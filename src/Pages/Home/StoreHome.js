import React from 'react';
import ScrollIntoView from 'react-scroll-into-view';

const StoreHome = () => {
	return (
		<div className="col-xl-10 col-lg-9 col-md-8 pt-5 ml-auto m-0 p-0 store-home">
			<div className="carousel-store">
				<div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
					<ol className="carousel-indicators">
						<li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
						<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
						<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
						<li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
					</ol>
					<div className="carousel-inner">
						<div className="carousel-item active carousel-item-0">
							<img
								className="d-block w-100"
								src={require('../../Assets/Images/carousel-11.png')}
								alt="Zero slide"
							/>
						</div>
						<div className="carousel-item carousel-item-1">
							<img
								className="d-block w-100"
								src={require('../../Assets/Images/carousel-22.png')}
								alt="First slide"
							/>
						</div>
						<div className="carousel-item carousel-item-2">
							<img
								className="d-block w-100"
								src={require('../../Assets/Images/carousel-33.png')}
								alt="Second slide"
							/>
						</div>
						<div className="carousel-item carousel-item-2">
							<img
								className="d-block w-100"
								src={require('../../Assets/Images/carousel-44.png')}
								alt="Third slide"
							/>
						</div>
					</div>
					<a
						className="carousel-control-prev"
						href="#carouselExampleIndicators"
						role="button"
						data-slide="prev"
					>
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="sr-only">Previous</span>
					</a>
					<a
						className="carousel-control-next"
						href="#carouselExampleIndicators"
						role="button"
						data-slide="next"
					>
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="sr-only">Next</span>
					</a>
				</div>
			</div>
			<div className="row">
				<div className="col-4 store-categories-2 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Backgrounds">
						<img className="img-fluid" src={require('../../Assets/Images/Bg_Home.png')} />
					</ScrollIntoView>
				</div>
				<div className="col-4 store-categories-1 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Logos">
						<img className="img-fluid" src={require('../../Assets/Images/Logo_home.png')} />
					</ScrollIntoView>
				</div>
				<div className="col-4 store-categories-1 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Scripts">
						<img className="img-fluid" src={require('../../Assets/Images/Script_home.png')} />
					</ScrollIntoView>
				</div>
				<div className="col-4 store-categories-1 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Audios">
						<img className="img-fluid" src={require('../../Assets/Images/AV_Home1.png')} />
					</ScrollIntoView>
				</div>
				<div className="col-4 store-categories-2 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Props">
						<img className="img-fluid" src={require('../../Assets/Images/Props_Home.png')} />
					</ScrollIntoView>
				</div>
				<div className="col-4 store-categories-2 m-0 p-0">
					<ScrollIntoView smooth="true" alignToTop="true" selector="#Characters">
						<img className="img-fluid" src={require('../../Assets/Images/Char_home.png')} />
					</ScrollIntoView>
				</div>
			</div>
		</div>
	);
};

export default StoreHome;
