import React, {Component} from "react";

export class ReminderButton extends Component {
  state = {
    label: "Send reminder",
    disabled: false
  };

  render() {
    return (
        <button className="reminder-button"
                disabled={this.state.disabled}
                onClick={() => this.setState({label: 'Reminder sent!', disabled: true})}>
          {this.state.label}
        </button>
    )
  }
}