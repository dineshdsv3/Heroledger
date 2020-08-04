import React from 'react';

function PreLogin() {
	return (
		<div>
			<div className="header-video">
				<div id="hero_video">
					<div id="sub_content">
						<img src={require('../../Assets/Images/heroledger.png')} width={250} height={40} />
						<p className="comic_text">connecting all comic creators in one</p>
					</div>
                   
					{/* End sub_content */}

					{/* <ul className="home-social-list">
              <li>
                <a href="https://twitter.com/rastrtech">
                  <i className="fab fa-twitter" />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Rastr-Technologies-835477423465014/">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/rastr">
                  <i className="fab fa-linkedin-in" />
                </a>
              </li>
              <li>
                <a href="https://heroledger.slack.com/">
                  <i className="fab fa-slack" />
                </a>
              </li>
              <li>
                <a href="https://t.me/HeroLedger">
                  <i className="fab fa-telegram-plane" />
                </a>
              </li>
              <li>
                <a href="https://discordapp.com/invite/C6MAbe5">
                  <i className="fab fa-discord" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-pinterest-p" />
                </a>
              </li>
            </ul> */}
				</div>
				<div id="count" className="hidden-xs">
					<ul>
						<li>
							<span className="number">3</span> Users
						</li>
						<li>
							<span className="number">5</span> Comic Assets
						</li>
						<li>
							<span className="number">2</span> Members
						</li>
						<li>
							<span className="number">10</span> Transactions
						</li>
						<li>
							<span className="number">100</span> Tokens Sold
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default PreLogin;
