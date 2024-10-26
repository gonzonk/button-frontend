import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface RatingDoc extends BaseDoc {
  parent: ObjectId;
  numberRaters: number;
  averageRating: number;
  type: string;
}

/**
 * concept: Rating[Content]
 */
export default class RatingConcept {
  public readonly ratings: DocCollection<RatingDoc>;

  /**
   * Make a ratings instance
   */
  constructor(name: string) {
    this.ratings = new DocCollection<RatingDoc>(name);
  }

  async getRating(parent: ObjectId, type: string) {
    const rating = await this.ratings.readOne({ parent: parent, type: type });
    console.log(rating);
    // console.log(await this.ratings.readMany({}));
    return { msg: "Got Rating", rating: rating };
  }

  async rate(parent: ObjectId, rating: number, type: string) {
    const rat = await this.ratings.readOne({ parent: parent, type: type });
    console.log("rat", rat);
    if (rat) {
      const newRating = (rat.averageRating * rat.numberRaters) / (rat.numberRaters + 1) + rating / (rat.numberRaters + 1);
      await this.ratings.partialUpdateOne({ _id: rat._id, type: type }, { numberRaters: rat.numberRaters + 1, averageRating: newRating });
    } else {
      await this.ratings.createOne({ parent: parent, numberRaters: 1, averageRating: rating, type: type });
    }
    return { msg: "Successfully rated!" };
  }
}
