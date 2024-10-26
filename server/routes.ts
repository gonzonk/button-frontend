import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Commenting, DifficultyRating, Friending, Posting, QualityRating, Sessioning, Stitching } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";
/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional(), _id: z.string().optional(), community: z.string().optional() }))
  async getPosts(author?: string, _id?: string, community?: string) {
    let posts;
    console.log("post search");
    if (author) {
      console.log("author search");
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else if (_id) {
      console.log("search by id");
      const id = new ObjectId(_id);
      posts = await Posting.getPostById(id);
    } else if (community) {
      console.log("community search");
      posts = await Posting.getByCommunity(community);
      console.log(posts);
    } else {
      console.log("all search");
      posts = await Posting.getPosts();
    }
    console.log(posts);
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, blueprintMedia: string, thumbnailMedia: string, title: string, description: string, community: string, tags: string[], options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, blueprintMedia, thumbnailMedia, title, description, community, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.post("/posts/:id")
  async updatePost(
    session: SessionDoc,
    id: string,
    blueprintMedia?: string,
    thumbnailMedia?: string,
    title?: string,
    description?: string,
    community?: string,
    tags?: string[],
    options?: PostOptions,
  ) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, blueprintMedia, thumbnailMedia, title, description, community, tags, options);
  }

  //anyone being able to add tags is intended behavior
  @Router.patch("/posts/:id")
  async addTag(session: SessionDoc, id: string, tag: string) {
    const oid = new ObjectId(id);
    return await Posting.addTag(oid, tag);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  @Router.put("/comments")
  async createComment(session: SessionDoc, parentId: string, content: string) {
    const user = Sessioning.getUser(session);
    const comment = await Commenting.create(user, content, new ObjectId(parentId));
    return { msg: comment.msg, post: await Responses.comment(comment.comment) };
  }

  @Router.get("/comments")
  @Router.validate(z.object({ author: z.string().optional(), parent: z.string().optional() }))
  async getComments(author?: string, parent?: string) {
    let comments;
    if (parent) {
      const id = new ObjectId(parent);
      comments = await Commenting.getByParent(id);
    } else if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      comments = await Commenting.getByAuthor(id);
    } else {
      comments = await Commenting.getComments();
    }
    return Responses.comments(comments);
  }

  @Router.delete("/comments/:id")
  async deleteComment(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Commenting.assertAuthorIsUser(oid, user);
    return Commenting.delete(oid);
  }

  @Router.put("/qualityRatings/:id")
  async rateQuality(rating: number, contentId: string) {
    const newRating = await QualityRating.rate(new ObjectId(contentId), rating, "quality");
    console.log("place quality rating", newRating);
    return newRating;
  }

  @Router.get("/qualityRatings/:id")
  async getRatingQuality(contentId: string) {
    const rating = await QualityRating.getRating(new ObjectId(contentId), "quality");
    console.log("getting quality rating", rating);
    return { msg: rating.msg, rating: rating.rating };
  }

  @Router.put("/difficultyRatings/:id")
  async rateDifficulty(rating: number, contentId: string) {
    return await DifficultyRating.rate(new ObjectId(contentId), rating, "difficulty");
  }

  @Router.get("/difficultyRatings/:id")
  async getRatingDifficulty(contentId: string) {
    const rating = await DifficultyRating.getRating(new ObjectId(contentId), "difficulty");
    console.log("getting difficulty rating", rating);
    return { msg: rating.msg, rating: rating.rating };
  }

  @Router.put("/stitches")
  async makeStitch(session: SessionDoc, caption: string, media: string, parentId: ObjectId, community: string) {
    const user = Sessioning.getUser(session);
    const stitch = await Stitching.create(user, caption, media, new ObjectId(parentId), community);
    console.log("making new stitch");
    console.log(stitch);
    return { msg: stitch.msg, post: await Responses.stitch(stitch.stitch) };
  }

  @Router.get("/stitches")
  @Router.validate(z.object({ author: z.string().optional(), community: z.string().optional(), parent: z.string().optional(), id: z.string().optional() }))
  async getStitches(author?: string, community?: string, parent?: string, id?: string) {
    let stitches;
    if (id) {
      stitches = await Stitching.getStitchById(new ObjectId(id));
    } else if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      stitches = await Stitching.getByAuthor(id);
    } else if (parent) {
      console.log("parent search");
      const id = new ObjectId(parent);
      stitches = await Stitching.getByParent(id);
    } else if (community) {
      stitches = await Stitching.getByCommunity(community);
    } else {
      console.log("getting all stitches");
      stitches = await Stitching.getStitches();
    }
    console.log(stitches);
    return Responses.stitches(stitches);
  }

  @Router.delete("/stitches/:id")
  async deleteStitch(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Stitching.assertAuthorIsUser(oid, user);
    return Stitching.delete(oid);
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
