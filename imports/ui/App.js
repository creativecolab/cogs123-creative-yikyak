import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

//import Responses from "./Task.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Responses } from "../api/responses.js";

// App component represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      waitingForPeople: true,
      formSubmitted: this.props.formSubmitted
    };
  }

  // componentDidMount() {
  //   this.setState({ formSubmitted: this.props.formSubmitted });
  // }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via React ref
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const age = ReactDOM.findDOMNode(this.refs.age).value.trim();
    const sport = ReactDOM.findDOMNode(this.refs.sports).value.trim();

    console.log(name);
    console.log(age);
    console.log(sport);

    Responses.insert({
      name,
      age,
      sport,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });

    this.setState({ formSubmitted: true });
  }

  // toggleHideCompleted() {
  //   this.setState({
  //     hideCompleted: !this.state.hideCompleted
  //   });
  // }

  // renderTasks() {
  //   let filteredTasks = this.props.tasks;
  //   if (this.state.hideCompleted) {
  //     filteredTasks = filteredTasks.filter(task => !task.checked);
  //   }
  //   return filteredTasks.map(task => <Task key={task._id} task={task} />);
  // }

  render() {
    return (
      <div className="app-root">
        <div className="container">
          <header>
            <h1>Welcome to Creative Partner!@</h1>
            <h3>There are {this.props.userCount} peoples who participated!</h3>

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
                "Thanks for participation! Please wait for more people to participate..."
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
                      <tr>
                        <th>Age:</th>
                        <td>
                          <input type="number" ref="age" min="18" max="99" />
                        </td>
                      </tr>
                      <tr>
                        <th>Sport:</th>
                        <td>
                          <select name="sports" ref="sports">
                            <option value="soccer">soccer</option>
                            <option value="basketball">basketball</option>
                            <option value="volleyball">volleyball</option>
                            <option value="football">football</option>
                            <option value="nope">NOPE</option>
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

          {/* <ul>{this.renderTasks()}</ul> */}
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    responses: Responses.find({}, { sort: { createdAt: -1 } }).fetch(),
    userCount: Responses.find({}).count(),
    formSubmitted: Responses.find({ owner: Meteor.userId() }).count(),
    currentUser: Meteor.user()
  };
})(App);

FlowRouter.route("/pizza/:_type", {
  name: "pizza",
  action(params, queryParams) {
    console.log(FlowRouter.getParam("_type") + " pizzza!");
  }
});
