import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface StitchDoc extends BaseDoc {
  author: ObjectId;
  caption: string;
  media: string;
  parent: ObjectId;
  community: string;
}

/**
 * concept: Stitching[Parent][Author]
 */
export default class StitchingConcept {
  public readonly stitches: DocCollection<StitchDoc>;

  /**
   * Make an instance of commenting
   */
  constructor(name: string) {
    this.stitches = new DocCollection<StitchDoc>(name);
  }

  async create(author: ObjectId, caption: string, media: string, parent: ObjectId, community: string) {
    const _id = await this.stitches.createOne({ author, caption, media, parent, community });
    return { msg: "Successfully stitched!", stitch: await this.stitches.readOne(_id) };
  }

  async getStitches() {
    return await this.stitches.readMany({}, { sort: { _id: -1 } });
  }

  async getStitchById(_id: ObjectId) {
    const stitch = await this.stitches.readOne({ _id });
    if (stitch === null) {
      throw new NotFoundError(`Post not found!`);
    }
    return [stitch];
  }

  async getByAuthor(author: ObjectId) {
    return await this.stitches.readMany({ author: author });
  }

  async getByCommunity(community: string) {
    return await this.stitches.readMany({ community });
  }

  async getByParent(parent: ObjectId) {
    return await this.stitches.readMany({ parent });
  }

  async delete(_id: ObjectId) {
    await this.stitches.deleteOne({ _id });
    return { msg: "Stitch deleted!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const stitch = await this.stitches.readOne({ _id });
    if (!stitch) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (stitch.author.toString() !== user.toString()) {
      throw new StitchAuthorNotMatchError(user, _id);
    }
  }
}

export class StitchAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
