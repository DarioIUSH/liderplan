import mongoose from 'mongoose';
import { IActivity, ActivityStatus, ActivityPriority } from '../types/index.js';

const activitySchema = new mongoose.Schema<IActivity>(
  {
    description: {
      type: String,
      required: true,
    },
    responsible: {
      type: String,
      required: false, // Mantener para compatibilidad backwards
    },
    responsibles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    area: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    resources: {
      type: String,
      required: false,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(ActivityStatus),
      default: ActivityStatus.NOT_STARTED,
    },
    priority: {
      type: String,
      enum: Object.values(ActivityPriority),
      default: ActivityPriority.MEDIUM,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    comments: [
      {
        text: String,
        date: { type: Date, default: Date.now },
        author: String,
      },
    ],
    evidence: [
      {
        fileName: String,
        url: String,
        date: { type: Date, default: Date.now },
      },
    ],
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    } as any,
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
