import React from 'react';

function Dashboard() {
	return (
		<section>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
						<div className="row pt-5 mt-md-3 mb-5">
							<div className="col-xl-3 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="d-flex justify-content-between">
											<i className="fas fa-shopping-cart fa-3x text-warning"></i>
											<div className="text-right text-secondary">
												<h5>Asset Value</h5>
												<h3>$135,000</h3>
											</div>
										</div>
									</div>
									<div className="card-footer text-secondary">
										<i className="fas fa-sync mr-3"></i>
										<span>Updated Now</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="d-flex justify-content-between">
											<i className="fas fa-money-bill-alt fa-3x text-success"></i>
											<div className="text-right text-secondary">
												<h5>Assets</h5>
												<h3>100</h3>
											</div>
										</div>
									</div>
									<div className="card-footer text-secondary">
										<i className="fas fa-sync mr-3"></i>
										<span>Updated Now</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="d-flex justify-content-between">
											<i className="fas fa-users fa-3x text-info"></i>
											<div className="text-right text-secondary">
												<h5>Users</h5>
												<h3>90</h3>
											</div>
										</div>
									</div>
									<div className="card-footer text-secondary">
										<i className="fas fa-sync mr-3"></i>
										<span>Updated Now</span>
									</div>
								</div>
							</div>
							<div className="col-xl-3 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="d-flex justify-content-between">
											<i className="fas fa-chart-line fa-3x text-danger"></i>
											<div className="text-right text-secondary">
												<h5>Visitors</h5>
												<h3>45,000</h3>
											</div>
										</div>
									</div>
									<div className="card-footer text-secondary">
										<i className="fas fa-sync mr-3"></i>
										<span>Updated Now</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Dashboard;
