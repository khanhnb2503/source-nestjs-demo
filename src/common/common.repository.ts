import mongoose, { ClientSession, PopulateOptions } from 'mongoose';

interface IOptionPaginate {
  sort?: string;
  page?: number;
  pageSize?: number;
}

type ICallbackTransaction = () => Promise<any>;

export class CommonRepository<TModel extends mongoose.Document> {
  public TSchema: mongoose.Model<TModel>;

  constructor(_TSchema: mongoose.Model<TModel>) {
    this.TSchema = _TSchema;
  }

  createOne(params: any) {
    return new this.TSchema(params).save();
  }

  updateById(id: any, params: any, options?: { middlewares?: any }) {
    return this.TSchema.findByIdAndUpdate(id, params, Object.assign(params || {}, { new: true, middlewares: options?.middlewares })).exec();
  }
  
  async findWithPaginate(
    params: {
      conditions?: any;
      projections?: any;
      paginate?: IOptionPaginate;
      populate?: PopulateOptions | (PopulateOptions | string)[];
    },
    options?: { middlewares?: any },
  ) {
    const conditions = params.conditions || {};
    const paginate: any = {
      page: params.paginate?.page || 1,
      limit: params.paginate?.pageSize || 25,
    };
    if (paginate.limit == -1) {
      delete paginate.page;
      delete paginate.limit;
      paginate.pagination = false;
    }

    // verify query sort - value is [1] or [-1] -----------------------------------------
    if (params.paginate?.sort) {
      const sort: any = {};
      const paginateRequest: any = params.paginate;
      const sortValues: string[] = paginateRequest.sort.split(';');
      sortValues.forEach((sv: string) => {
        const value: string[] = sv.split(':');
        sort[value[0]] = +(value[1] || 1);
      });
      paginate.sort = sort;
    } else {
      paginate.sort = {
        createdAt: -1,
      };
    }

    if (params.projections) {
      paginate.select = params.projections;
    }
    if (params.populate) {
      paginate.populate = params.populate;
    }
    if (options?.middlewares) {
      paginate.options = { ...paginate.options, middlewares: options?.middlewares };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    const result = await this.TSchema.paginate(conditions, paginate);

    return {
      data: result.docs,
      totalItem: result.totalDocs,
      page: result.page,
      pageSize: result.limit,
      totalPage: result.totalPages,
    };
  }

  async findWithPaginateWithAggregation(
    params: {
      pipes: any[];
      paginate?: IOptionPaginate;
    },
    options?: { middlewares?: any },
  ) {
    const paginate: any = {
      page: Number(params.paginate?.page) || 1,
      limit: Number(params.paginate?.pageSize) || 25,
    };
    if (paginate.limit == -1) {
      delete paginate.page;
      delete paginate.limit;
      paginate.pagination = false;
    }

    let totalItems: any = await this.TSchema.aggregate(params.pipes).count('totalItems'); // [{ totalItems: 1 }]
    totalItems = totalItems[0]?.totalItems || 0;

    const aggregation = this.TSchema.aggregate(params.pipes, options);

    // verify query sort - value is [1] or [-1] -----------------------------------------
    if (params.paginate?.sort) {
      const sort: any = {};
      const paginateRequest: any = params.paginate;
      const sortValues: string[] = paginateRequest.sort.split(';');
      sortValues.forEach((sv: string) => {
        const value: string[] = sv.split(':');
        sort[value[0]] = +(value[1] || 1);
      });
      aggregation.sort(sort);
    }

    let page = JSON.parse(JSON.stringify(paginate)).page;
    let limit = JSON.parse(JSON.stringify(paginate)).limit;
    if (paginate?.limit && paginate?.page) {
      const skip = paginate.page > 1 ? (paginate.page - 1) * paginate.limit : 0;
      aggregation.skip(skip);
      aggregation.limit(limit);
    } else {
      page = 1;
      limit = totalItems;
    }

    //total page
    let totalPage = Math.floor(totalItems / limit);
    if (totalItems / limit > Math.floor(totalItems / limit)) {
      totalPage += 1;
    }

    const result = await aggregation.exec();

    return {
      data: result,
      totalItem: totalItems,
      page: page,
      pageSize: limit,
      totalPage: totalPage || 0,
    };
  }

  async findAllWithAggregation(params: { pipes: any[]; sort?: any }, options?: { middlewares?: any }) {
    const aggregation = this.TSchema.aggregate(params.pipes, options);
    if (params.sort) {
      aggregation.sort(params.sort);
    }

    const result = await aggregation.exec();
    return result;
  }

  async findOneWithAggregation(params: { pipes: any[] }, options?: { middlewares?: any }) {
    const aggregation = this.TSchema.aggregate(params.pipes, options);

    const [result] = await aggregation.exec();
    return result;
  }

  findById(params: { id: any; projections?: any; populate?: PopulateOptions | (PopulateOptions | string)[] }, options?: { middlewares?: any }) {
    const obj = this.TSchema.findById(params.id, params.projections || {}, options);
    if (params.populate) {
      obj.populate(params.populate);
    }
    return obj.exec();
  }

  findOneByParams(
    params: { conditions?: any; projections?: any; populate?: PopulateOptions | (PopulateOptions | string)[] },
    options?: { middlewares?: any },
  ) {
    const obj = this.TSchema.findOne(params.conditions || {}, params.projections || {}, options);
    if (params.populate) {
      obj.populate(params.populate);
    }
    return obj.exec();
  }

  findByParams(
    params?: { conditions?: any; projections?: any; populate?: PopulateOptions | (PopulateOptions | string)[] },
    options?: { middlewares?: any; sort?: any },
  ): any {
    const objs = this.TSchema.find(params?.conditions || {}, params?.projections || {}, options);
    if (params?.populate) {
      objs.populate(params?.populate);
    }
    return objs.exec();
  }

  /**
   * @attention function ``useTransaction`` không hoạt động với mongoDB standalone
   */
  async useTransaction(params: { session: ClientSession; callback: ICallbackTransaction }) {
    try {
      await params.session.withTransaction(async () => {
        try {
          await params.callback();
        } catch (error) {
          await params.session.abortTransaction();
          throw error;
        }
      });
    } catch (error) {
      throw error;
    } finally {
      await params.session.endSession();
    }
  }
}
