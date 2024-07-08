import { Schema } from 'mongoose';
import { getCurrentTime } from '../utils';

export const SCHEMA_OPTIONS: any = {
  versionKey: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  id: false,
  //timestamps: true, // disabled vì làm timestamps bằng tay để đồng bộ múi giờ sang +0
};

export const TIMESTAMPS_SCHEMA = {
  createdAt: {
    type: Schema.Types.Date,
    default: () => getCurrentTime()
  },
  updatedAt: {
    type: Schema.Types.Date,
    default: () => getCurrentTime()
  },
};
