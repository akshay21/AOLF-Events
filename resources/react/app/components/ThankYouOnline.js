import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';

class ThankYouOnline extends React.Component {
	
  constructor(props) {
		super(props)
		
		this.state = {
			event : {},
			userEmail : ''
		}
		
		if(this.props.location.state === null){
			this.props.router.push({
				pathname: '/events'
			})
		}
  }
  
  componentDidMount(){
	  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
			$('body').addClass('ios thank-you-page');
	  } else{
			$('body').addClass('web thank-you-page');
	  };
	  
	  var event = this.state.event;

	  addthis.layers.refresh();
	  addthis.update('share', 'url', window.INITIAL_STATE.url.baseurl + 'online/event/' + this.slugifyUrl(this.state.event.event_name) +  '/' + this.state.event.event_web_series_name + '/' + this.state.event.event_web_id)
	  addeventatc.refresh();
  }
  
  componentWillUnmount() {
	$('body').removeClass('thank-you-page');
  }
  
  slugifyUrl (string){
	  if(!string) return '';
	  
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
	if(this.props.location.state !== null){
		this.state.event = this.props.location.state.event;
		this.state.userEmail = this.props.location.state.userEmail;
		
		var event = this.state.event;
		
		var startDate = event.event_start.date;
	    var endDate = event.event_end.date;
		
		var organizer = this.state.event.organizers.map(function(item, i) {
			return item.email
		});
	}
	
	return (
		<div>
			<Helmet>
				<title data-react-helmet="true">{event.event_name}</title>
				<meta data-react-helmet="true" property="og:url" content={window.INITIAL_STATE.url.baseurl +'online/event/' + this.slugifyUrl(this.state.event.event_name) +  '/' + this.state.event.event_web_series_name + '/' + this.state.event.event_web_id} />
				<meta data-react-helmet="true" property="og:title" content="Mind & Meditation: FREE Mini Workshop" />
				<meta data-react-helmet="true" property="og:type" content="fitness" />
				<meta data-react-helmet="true" property="og:image" content="{{{baseurl}}}templates/ArtOfLiving/images/home_banner_fb.jpg" />
				<meta data-react-helmet="true" property="fb:app_id" content="547829512233839" />
				<meta data-react-helmet="true" property="og:description" content="Unlock the power of your breath and discover the easy, effective approach to meditation that has already helped millions." />
			</Helmet>
		  <section className="thank_you_container">
			<div className="inner_container">
				<h6>Thank you, your seat has been reserved</h6>
				<p>A confirmation email has been sent to {this.state.userEmail}</p>
				<h1>
					You&#8217;re all set to experience the <strong>Mind & Meditation</strong> workshop and discover the power of the breath.
				</h1>

				<div className="thank_you_buttons">
					<a href="#">
						<div title="Add to Calendar" className="addeventatc">
							Add to Calendar
							<span className="alarm_reminder">120</span>
							<span className="start">{(startDate.month + 1) + '/' + startDate.date + '/' + startDate.year + ' ' + startDate.time_hours + ':' + startDate.time_minutes + ' ' + startDate.am_pm}</span>
							<span className="end">{(endDate.month + 1) + '/' + endDate.date + '/' + endDate.year + ' ' + endDate.time_hours + ':' + endDate.time_minutes + ' ' + endDate.am_pm}</span>
							<span className="timezone">{this.state.event.event_start.timezone}</span>
							<span className="title">{this.state.event.event_name}</span>
							<span className="description">{'For details, link here:' + window.INITIAL_STATE.url.baseurl + 'online/event/' + this.slugifyUrl(event.event_name) +  '/' + event.event_web_series_name + '/' + event.event_web_id}</span>
							<span className="location">{"Online Event"}</span>
						</div>
					</a>
				</div>
				<p>
					This event is best enjoyed with friends. Click below to share:
				</p>
				<div className="addthis_inline_share_toolbox"></div>
				<p>
					<a href={"mailto:" + organizer.toString() + "?cc=Anna.chicgo@artofliving.org&body=" + window.INITIAL_STATE.url.baseurl + 'online/event/' + this.slugifyUrl(this.state.event.event_name) +  '/' + this.state.event.event_web_series_name + '/' + this.state.event.event_web_id}>Contact us</a> if you have any questions about the event.
				</p>
				<hr/>
			</div>
			<div className="second_inner">
				<p>
					Based on your interest in Mind & Meditation, you may also enjoy these articles:
				</p>
			</div>
			<div className="recent_articles">
				<article className="recent_article">
					<a href="#" className="recent_article--image">
						<img src="/templates/ArtOfLiving/images/thank-you-article1.png" alt="title" />
					</a>
					<h3 className="recent_article--title">
						<a href="https://www.artofliving.org/us-en/meditation/meditation-for-you/benefits-of-meditation">Benefits of Meditation </a>
					</h3>
					<p>
						The Health Benefits of Meditation From the medical community to the yoga community, the verdict is out: you need to meditate! Recent studies from Harvard
					</p>
					<div>
						<a href="https://www.artofliving.org/us-en/meditation/meditation-for-you/benefits-of-meditation" className="read_more">
							Read more
						</a>
					</div>
				</article>
				<article className="recent_article">
					<a href="#" className="recent_article--image">
						<img src="/templates/ArtOfLiving/images/thank-you-article2.png" alt="title" />
					</a>
					<h3 className="recent_article--title">
						<a href="https://www.artofliving.org/us-en/7-attitudes-truly-happy-people">7 Attitudes of Truly  Happy People </a>
					</h3>
					<p>
						1. Is being stressed a sign of prosperity,  growth, or dignity?
					</p>
					<div>
						<a href="https://www.artofliving.org/us-en/7-attitudes-truly-happy-people" className="read_more">
							Read more
						</a>
					</div>
				</article>
				<article className="recent_article">
					<a href="#" className="recent_article--image">
						<img src="/templates/ArtOfLiving/images/thank-you-article3.png" alt="title" />
					</a>
					<h3 className="recent_article--title">
						<a href="https://www.artofliving.org/us-en/yoga/sun-salutations">Sun Salutation Yoga  Sequence (Surya Namaskar) </a>
					</h3>
					<p>
						Change is hard and most of us resist any change. Even though change may be
					</p>
					<div>
						<a href="https://www.artofliving.org/us-en/yoga/sun-salutations" className="read_more">
							Read more
						</a>
					</div>
				</article>
			</div>
		</section>
		</div>
	  );
  }
};


const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};


const connectedContainer = connect(mapStateToProps)(ThankYouOnline);
const RoutedContainer = withRouter(connectedContainer);
export default RoutedContainer;