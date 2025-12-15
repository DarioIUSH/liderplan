import mongoose from 'mongoose';
import { IPlan } from '../types/index.js';

const planSchema = new mongoose.Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    project: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
      enum: ['Plan de desarrollo', 'Plan de mejoramiento'],
    },
    subOrigin: {
      type: String,
      required: false,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
  },
  { timestamps: true }
);

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
