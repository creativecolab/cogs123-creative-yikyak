import React, { Component } from "react";
import { Messages } from "../api/messages.js";

export default class Message extends Component {
  upvoteThisMessage() {
    Messages.update(this.props.message._id, {
      $push: { user_likes: this.props.user }
    });
    Messages.update(this.props.message._id, {
      $set: { updatedAt: new Date() }
    });
  }

  downvoteThisMessage() {
    Messages.update(this.props.message._id, {
      $pull: { user_likes: this.props.user }
    });
    Messages.update(this.props.message._id, {
      $set: { updatedAt: new Date() }
    });
  }

  // used to check if a user already upvoted this message
  userVoted() {
    let users = Messages.find(
      { _id: this.props.message._id },
      { user_likes: 1 }
    ).fetch();
    console.log(users);

    if (!users) return false;

    if (users[0].user_likes.indexOf(this.props.user) == -1) {
      return false;
    }

    return true;
  }

  render() {
    let color =
      this.props.message.user_likes.length > 0
        ? "{color: green}"
        : "{color: red}";

    return (
      <li>
        {this.userVoted() ? (
          <button
            className="upvoted"
            onClick={this.downvoteThisMessage.bind(this)}
          >
            {this.props.message.user_likes.length > 0 ? "+" : ""}
            {this.props.message.user_likes.length} &#9660;
          </button>
        ) : (
          <button
            className="novote"
            onClick={this.upvoteThisMessage.bind(this)}
          >
            {this.props.message.user_likes.length > 0 ? "+" : ""}
            {this.props.message.user_likes.length} &#9650;
          </button>
        )}
        <span className="text">
          <strong>{this.props.message.owner}</strong>:&nbsp;
          {this.props.message.text}
        </span>
      </li>
    );
  }
}
