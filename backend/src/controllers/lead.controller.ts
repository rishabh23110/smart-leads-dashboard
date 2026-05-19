import { Response, NextFunction } from 'express';
import { stringify } from 'csv-stringify';
import mongoose, { type QueryFilter } from 'mongoose';
import { Lead } from '../models/Lead.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest, ApiResponse, PaginationMeta, ILead } from '../types/index.js';
import {
  CreateLeadInput,
  UpdateLeadInput,
  LeadQueryInput,
} from '../validators/lead.validator.js';

type LeadFilter = QueryFilter<ILead>;

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, status, source, search, sort } = req.query as unknown as LeadQueryInput;

    const filter: LeadFilter = {};

    if (status) filter['status'] = status;
    if (source) filter['source'] = source;
    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.user?.role === 'sales') {
      filter['createdBy'] = req.user.id;
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);
    const meta: PaginationMeta = {
      totalRecords,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    const response: ApiResponse = { success: true, data: leads, meta };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) return next(new AppError('Lead not found', 404));

    const createdById =
      typeof lead.createdBy === 'object' && lead.createdBy !== null
        ? (lead.createdBy as { _id: mongoose.Types.ObjectId })._id.toString()
        : String(lead.createdBy);

    if (req.user?.role === 'sales' && createdById !== req.user.id) {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body as CreateLeadInput;
    const lead = await Lead.create({ ...body, createdBy: req.user?.id });
    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      return next(new AppError('You can only edit your own leads', 403));
    }

    const body = req.body as UpdateLeadInput;
    const updated = await Lead.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({ success: true, message: 'Lead updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as Partial<LeadQueryInput>;
    const filter: LeadFilter = {};

    if (status) filter['status'] = status;
    if (source) filter['source'] = source;
    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.user?.role === 'sales') filter['createdBy'] = req.user.id;

    const leads = await Lead.find(filter).lean();

    const rows = leads.map((l) => ({
      Name: l.name,
      Email: l.email,
      Status: l.status,
      Source: l.source,
      'Created At': new Date(l.createdAt).toISOString(),
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    stringify(rows, { header: true }).pipe(res);
  } catch (err) {
    next(err);
  }
};

export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: LeadFilter = {};
    if (req.user?.role === 'sales') filter['createdBy'] = req.user.id;

    const [total, byStatus, bySource] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.aggregate([{ $match: filter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $match: filter }, { $group: { _id: '$source', count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({ success: true, data: { total, byStatus, bySource } });
  } catch (err) {
    next(err);
  }
};
