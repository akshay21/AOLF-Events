import React from 'react';
import { connect } from 'react-redux'
import { submitContactForm } from '../../../actions/contact';
import Messages from '../../Messages';
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router'
import fetch from 'isomorphic-fetch'

class Contact extends React.Component {
  constructor(props) {
    super(props);
	this.onSuccess = this.onSuccess.bind(this);
    this.state = { name: '', email: '', tel : '', event : {}, events : {}, addClassName : ''};
	this.onSubmit = true;
  }

  handleChange(event) {
	var _this = this;
	var flag = true;
	
	if(event.target.name == 'name'){
		$(_this.name).next().html('');
		if(!event.target.value){
			$(_this.name).next().html('Please fill this field');
			flag = false;
		}
	}
	
	if(event.target.name == 'tel'){
		$(_this.tel).next().html('');
		if(!event.target.value){
			$(_this.tel).next().html('Please fill this field');
			flag = false;
		}
		
		if(event.target.value.length > 10){
			$(_this.tel).next().html('Please use 10 digit mobile number');
			flag = false;
		}
	}
	
	if(event.target.name == 'email'){
		$(_this.email).next().html('');
		// Clear timeout before 1 sec;
		clearTimeout(this.timer);
		
		//Wait for 1 sec before sending request;
		var email = event.target.value;
		var name = event.target.name;
		this.timer = setTimeout(function() { 
			fetch("/api/content/contact/email/verification", {
			  method: 'post',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({
				email: email
			  })
			}).then((response) => {
			  if (response.ok) {
				return response.json().then((json) => {
				  $(_this.email).after().html('');
				});
			  } else {
				return response.json().then((json) => {
				  flag = false;
				  $(_this.email).next().html(json.msg);
				});
			  }
			});
		}, 1500);
	}  
	
	if(flag) this.onSubmit = true
	else this.onSubmit = false;

    this.setState({ [event.target.name] : event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
	if(this.onSubmit === false) return;
	$(this.loader).removeClass('display-none');
    this.props.dispatch(submitContactForm(this.state.name, this.state.email, this.state.tel, this.state.event, this.onSuccess));
  }
  
  filterEvent(eventid){
	  var event = {};
	  this.props.events.map(function(item, i) {
		  if(item.event_web_id == eventid) event = item;
	  })
	  return event;
  }
  
  componentDidMount(){
	  var that = this 
	  var state = this.state 
	  
	  // Get value from select and load the event;
	  $(this.SelectBox).styler({
		  onSelectClosed: function(select) {
			  var eventId = $(that.SelectBox).val() ? $(that.SelectBox).val() : '';
			  
			  if(!state.event || !Object.keys(state.event).length){
				  that.state.event = that.filterEvent(eventId);
			  }
			  
			  var event = state.event ? state.event : that.props.events[0];
			  var eventState = event.address.state ? that.slugifyUrl(event.address.state) : 'ca';
			  var eventCity = event.address.city ? that.slugifyUrl(event.address.city) : 'los-angeles';
			  
			  browserHistory.push('/' + eventState + '/' + eventCity + '/' + that.slugifyUrl(state.event.event_name) +  '/' + event.event_web_series_name + '/' + eventId);
		  },
	  });
  }
   
  onSuccess (){	
	  var state = this.state   
	  var eventId = $(this.SelectBox).val() ? $(this.SelectBox).val() : '';
	  
	  if(!state.event || !Object.keys(state.event).length){
		  this.state.event = this.filterEvent(eventId);
	  }
	  
	  var event = state.event ? state.event : this.props.events[0];
	  var eventState = event.address.state ? this.slugifyUrl(event.address.state) : 'ca';
	  var eventCity = event.address.city ? this.slugifyUrl(event.address.city) : 'los-angeles';
	  $(this.loader).addClass('display-none');

	  this.props.router.push({
	    pathname: '/' + eventState + '/' + eventCity + '/' + this.slugifyUrl(state.event.event_name) +  '/' + event.event_web_series_name + '/' + eventId +'/thankyou',
		state: {
			event: this.state.event,
			userEmail: this.state.email
		}
	  });
  }
  
  formatDateTime(event){
	  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	  var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	  
	  var date = new Date(event.event_start.local);
	  
	  var start_time = new Date(event.event_start.local);
	  var start_time_hours = start_time.getHours() > 12 ? start_time.getHours() - 12 : start_time.getHours();
	  var start_time_minutes = start_time.getMinutes() < 10 ? "0" + start_time.getMinutes() : start_time.getMinutes();
	  var start_am_pm = start_time.getHours() >= 12 ? "PM" : "AM";
	  
	  var end_time = new Date(event.event_end.local);
	  var end_time_hours = end_time.getHours() > 12 ? end_time.getHours() - 12 : end_time.getHours();
	  var end_time_minutes = end_time.getMinutes() < 10 ? "0" + end_time.getMinutes() : end_time.getMinutes();
	  var end_am_pm = end_time.getHours() >= 12 ? "PM" : "AM";	  
	  
	  return days[date.getDay()] + ' ' + month[date.getMonth()] + date.getDate() + ': ' + start_time_hours + ':' + start_time_minutes + ' ' + start_am_pm + ' - ' + end_time_hours + ':' + end_time_minutes + ' ' + end_am_pm;  
  }
  
  slugifyUrl (string){
		return string
			.toString()
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\-]+/g, "")
			.replace(/\-\-+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");
  }

  render() {
	var that = this;
	var events = this.props.events;
	var eventid = this.props.eventid;
	
	if(eventid){
		var checkIfEvent = (<button>Save My Spot <i ref={(loader) => this.loader = loader} className="fa fa-circle-o-notch fa-spin fa-fw display-none" aria-hidden="true"></i></button>);
		
		var selectBox = events.map(function(item, i) {
			if(eventid == item.event_web_id){
				that.state.event = item;
				return <option value={item.event_web_id} selected>{that.formatDateTime(item)}</option>
			}else{
				return <option value={item.event_web_id}>{that.formatDateTime(item)}</option>
			}
		})
		
	} else {
		var checkIfEvent = (<button className="disabled" disabled>Save My Spot</button>);
		var selectBox = events.map(function(item, i) {
			return <option value={item.event_web_id}>{that.formatDateTime(item)}</option>
		})
	}
	
	var style = {
		highlight : {
			"background" : "url(/templates/" + process.env.REACT_TEMPLATE + "/images/highlight_bg.png) no-repeat scroll 50% 50% /cover"
		}
	};
	
    return (
	  <div>
		  <section className={this.props.addClassName + " highlight"} style={style.highlight} id="chose_day">
				<h2 className="highlight__overlay_title">
				{events[0].event_name}
				</h2>
				<div className="row">
					<div className="col-md-12">
						<div className="highlight--left_block">
							<h2>{events[0].event_name}</h2>
							<h5>Register Now for FREE</h5>
						</div>
						<div className="highlight--right_block">
							<h3>Choose a date & time</h3>
							<select ref={(select) => {this.SelectBox = select }}>
								<option value="">Select Date</option>
								{selectBox}
							</select>
						</div>
						<div className="col-md-12">
							<div class="col-md-5"></div>
							<div class="col-md-7">
								<Messages messages={this.props.messages}/>
							</div>
						</div>
						<form onSubmit={this.handleSubmit.bind(this)} >
							<div>
								<input type="text" ref={(name) => this.name = name} name="name" onChange={this.handleChange.bind(this)} placeholder="First Name *" required />
								<div className="error"></div>
								<input type="email" name="email" ref={(email) => this.email = email} onChange={this.handleChange.bind(this)} placeholder="Email *" required />
								<div className="error"></div>
							</div>
							<div>
								<input type="text" ref={(tel) => this.tel = tel} name="tel" onChange={this.handleChange.bind(this)} placeholder="Phone *" required />
								<div className="error"></div>
								{checkIfEvent}
							</div>
							<p>
								By registering I agree to the <a href="https://www.artofliving.org/us-en/privacy-policy" target="_blank">privacy policy</a>, confirm that I am at least 18 years of age, and agree to receive promotional phone calls, text messages, and e-mails from The Art of Living. We respect your privacy and you can unsubscribe at any time.
							</p>
						</form>
					</div>
				</div>
			</section>
	    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

const connectedContainer = connect(mapStateToProps)(Contact);
const RoutedContainer = withRouter(connectedContainer);
export default RoutedContainer;