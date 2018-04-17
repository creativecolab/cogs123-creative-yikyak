import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

//import Responses from "./Task.js";

import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Responses } from "../api/responses.js";
import { Messages } from "../api/messages.js";

import Message from "./Message.js";

import { mount, withOptions } from "react-mounter";

// App component represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      waitingForPeople: true,
      formSubmitted: this.props.formSubmitted
    };
    console.log(this.props.formSubmitted);
  }

  filterUsers() {
    let filteredUsers = this.props.responses;
  }

  selectTopic() {
    const newTopic = ReactDOM.findDOMNode(this.refs.topic_select).value.trim();
    console.log(newTopic);
    this.setState({
      currentTopic: newTopic
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => <Task key={task._id} task={task} />);
  }

  // componentDidMount() {
  //   this.setState({ formSubmitted: this.props.formSubmitted });
  // }

  handleSubmitMessage(event) {
    event.preventDefault();

    // Find the text field via React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const topic = this.state.currentTopic;

    Messages.insert({
      text,
      topic,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = "";
    console.log(text);
    console.log(topic);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via React ref
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const topic = ReactDOM.findDOMNode(this.refs.topics).value.trim();

    console.log(name);
    console.log(topic);

    ReactDOM.findDOMNode(this.refs.topic_select).value = topic;

    Responses.insert({
      name,
      topic,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });

    this.setState({ formSubmitted: true, currentTopic: topic });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.formSubmitted) {
      console.log("YOOOO@@!! " + this.props.userCount);
      // FlowRouter.go("pizza", {
      //   _type: "tomato"
      // });
    } else {
      console.log("NOPE.");
    }
    console.log("form submitted? " + this.props.formSubmitted);
    return true;
  }

  // handleSubmit(event) {
  //   event.preventDefault();

  //   // Find the text field via React ref
  //   const name = this.props.currentUser.name;
  //   const topic = ReactDOM.findDOMNode(this.refs.topics).value.trim();

  //   console.log(name);
  //   console.log(topic);

  //   Messages.insert({
  //     name,
  //     topic,
  //     createdAt: new Date(), // current time
  //     owner: Meteor.userId(),
  //     username: Meteor.user().username
  //   });

  //   this.setState({ formSubmitted: true });
  // }

  // toggleHideCompleted() {
  //   this.setState({
  //     hideCompleted: !this.state.hideCompleted
  //   });
  // }

  renderMessages() {
    let filteredMessages = this.props.messages;
    if (this.state.formSubmitted) {
      filteredMessages = filteredMessages.filter(
        message => message.topic == this.state.currentTopic
      );
    }
    return filteredMessages.map(message => (
      <Message key={message._id} message={message} />
    ));
  }

  render() {
    return (
      <div className="app-root">
        <div className="container">
          <header>
            <h1>Welcome to Creative Partner!@</h1>
            <h3>There are {this.props.userCount} peoples who participated!</h3>
            <label className="hide-completed">
              <form onChange={this.selectTopic.bind(this)}>
                <select name="topic_select" ref="topic_select">
                  <option value="tomato">tomato</option>
                  <option value="pickle">pickle</option>
                  <option value="philz">philz</option>
                  <option value="dogs">dogs</option>
                  <option value="cogs123">cogs123</option>
                </select>
              </form>
            </label>
            {/* <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label> */}

            <AccountsUIWrapper />

            {this.props.currentUser ? (
              this.state.formSubmitted ? (
                this.props.currentUser ? (
                  <form
                    className="new-message"
                    onSubmit={this.handleSubmitMessage.bind(this)}
                  >
                    <input
                      type="text"
                      ref="textInput"
                      placeholder="Type to add new messages"
                    />
                  </form>
                ) : (
                  ""
                )
              ) : (
                <form
                  className="new-response"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <table>
                    <tbody>
                      <tr>
                        <th>Name:</th>
                        <td>
                          <input
                            type="text"
                            ref="name"
                            defaultValue={this.props.currentUser.username}
                          />
                        </td>
                      </tr>
                      {/* <tr>
                        <th>Age:</th>
                        <td>
                          <input type="number" ref="age" min="18" max="99" />
                        </td>
                      </tr> */}
                      <tr>
                        <th>Topic:</th>
                        <td>
                          <select name="topics" ref="topics">
                            <option value="tomato">tomato</option>
                            <option value="pickle">pickle</option>
                            <option value="philz">philz</option>
                            <option value="dogs">dogs</option>
                            <option value="cogs123">cogs123</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <input
                    className="submit-button"
                    type="submit"
                    value="Submit!!"
                  />
                </form>
              )
            ) : (
              ""
            )}
          </header>
          <ul>{this.renderMessages()}</ul>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    responses: Responses.find({}, { sort: { createdAt: -1 } }).fetch(),
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    userCount: Responses.find({}).count(),
    formSubmitted: Responses.find({ owner: Meteor.userId() }).count(),
    currentUser: Meteor.user()
  };
})(App);

FlowRouter.route("/pizza/:_type", {
  name: "pizza",
  action(params, queryParams) {
    mount(Pizza, { type: FlowRouter.getParam("_type") });
  }
});

FlowRouter.route("/", {
  name: "App.home",
  action(params, queryParams) {}
});

class Pizza extends Component {
  renderMessages() {
    let allMessages = this.props.messages;
    return allMessages.map(message => (
      <Message key={message._id} message={message} />
    ));
  }

  render() {
    return (
      <div>
        <h1>PIzza! {this.props.type} </h1>
        {/* <ul>{this.renderMessages()}</ul> */}
      </div>
    );
  }
}
