import React, { Component } from "react";
import { Messages } from "../api/messages.js";

// Task component - represents a single todo item
export default class Message extends Component {
  //   toggleChecked() {
  //     Tasks.update(this.props.task._id, {
  //       $set: { checked: !this.props.task.checked }
  //     });
  //   }

  deleteThisMessage() {
    Messages.remove(this.props.message._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSSs
    return (
      <li>
        <button className="delete" onClick={this.deleteThisMessage.bind(this)}>
          &times;
        </button>
        <span className="text">
          <strong>
            {this.props.message.username}@{this.props.message.topic}
          </strong>:&nbsp;
          {this.props.message.text}
        </span>
      </li>
    );
  }
}
