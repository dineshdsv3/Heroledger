import React, { useState, useEffect, useRef } from 'react';
import { select, line } from 'd3';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

function Dashboard() {
	const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
	const svgRef = useRef();
	const geoUrl =
		'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

	const user = JSON.parse(localStorage.getItem('user'));
	console.log(user);
	useEffect(() => {
		const svg = select(svgRef.current);

		// Curved Line Chart
		const myLine = line()
			.x((value, index) => index * 50)
			.y((value) => 100 - value);

		svg.selectAll('.dot')
			.data(data)
			.enter()
			.append('circle') // Uses the enter().append() method
			.attr('class', 'dot') // Assign a class for styling
			.attr('cx', function (d, i) {
				return i * 50;
			})
			.attr('cy', function (d) {
				return 100 - d;
			})
			.attr('r', 5);

		svg.selectAll('path')
			.data([data])
			.join('path')
			.attr('d', (value) => myLine(value))
			.attr('fill', 'none')
			.attr('stroke', 'orange');
	}, [data]);

	return (
		<section>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
						<div className="row pt-5 mt-md-3 mb-5">
							<div className="col-xl-4 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="text-secondary">
											<small>Earnings Overview (Last 7 Days)</small>
										</div>
										<div>
											<b>$ 14K</b> <br />
											<i className="fa fa-arrow-up text-success" aria-hidden="true"></i>
											<small>&nbsp;17% since last day</small>
										</div>
										<div>
											<svg ref={svgRef}></svg>
										</div>
										<div className="d-flex mt-auto pt-auto justify-content-around">
											<div className="d-flex justify-content-between">
												<div>
													<img
														className="rounded-circle"
														src={require('../../Assets/Images/Venom.png')}
														width="30"
														height="30"
													/>
												</div>
												<div className="font-14">
													Asset 1 <br />$ 2,000
												</div>
											</div>
											<div className="d-flex justify-content-around">
												<div>
													<img
														className="rounded-circle"
														src={require('../../Assets/Images/Thor.png')}
														width="30"
														height="30"
													/>
												</div>
												<div className="font-14">
													Asset 2 <br />$ 1,200
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-6 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="text-secondary">
											<small>Assets (Last 7 Days)</small>
										</div>
										<div>
											<b>$ 842.00</b> <br />
											<i className="fa fa-arrow-up text-success" aria-hidden="true"></i>
											<small>&nbsp;42% since last day</small>
										</div>
										<div>
											<table className="table font-9 mt-2 table-borderless">
												<tbody>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/Venom.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 1</td>
														<td>{user.name}</td>
														<td>$ 180</td>
														<td>2020-03-03</td>
													</tr>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/Thor.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 2</td>
														<td>{user.name}</td>
														<td>$ 140</td>
														<td>2020-03-03</td>
													</tr>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/SpiderMan.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 3</td>
														<td>{user.name}</td>
														<td>$ 300</td>
														<td>2020-03-03</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-sm-6 p-2">
								<div className="card card-dashboard">
									<div className="card-body">
										<div className="text-secondary">
											<small>Token Balance</small>
										</div>
										<div>
											<b>148</b>
										</div>
										<div className="mt-2">
											<span className="font-10">
												Tokens Collected <br />
												(Last 7 days)
												<br />
											</span>
											<b>34</b>
											<br />
											<span className="font-10">
												<i className="fa fa-arrow-up text-success" aria-hidden="true"></i>
												&nbsp;17% last week
											</span>
										</div>
									</div>
									<div className="card-footer py-1">
										<div>
											<span className="font-10">
												Tokens Collected <br />
												(Last 7 days)
												<br />
											</span>
											<b>21</b>
											<br />
											<span className="font-10">
												<i className="fa fa-arrow-down text-danger" aria-hidden="true"></i>
												&nbsp;22% last week
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-7 col-sm-6 p-2">
								<div className="card card-dashboard card-dashboard-2">
									<div className="card-body">
										<div className="text-secondary">
											<small>Transactions (Last 7 Days)</small>
										</div>
										<div>
											<table className="table font-9 mt-2 table-borderless">
												<tbody>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/Venom.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 1</td>
														<td>0xe509a834bf9ee3c27af895609e5cdd2f455c4854</td>
														<td>$ 300</td>
														<td>2020-03-03</td>
													</tr>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/Thor.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 2</td>
														<td>0xe509a834bf9ee3c27af895609e5cdd2f455c4854</td>
														<td>$ 140</td>
														<td>2020-03-03</td>
													</tr>
													<tr>
														<th scope="row">
															{' '}
															<img
																className="rounded-circle"
																src={require('../../Assets/Images/Thor.png')}
																width="30"
																height="30"
															/>
														</th>
														<td>Asset 3</td>
														<td>0xe509a834bf9ee3c27af895609e5cdd2f455c4854</td>
														<td>$ 180</td>
														<td>2020-03-03</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-5 col-sm-6 p-2">
								<div className="card card-dashboard card-dashboard-2">
									<div className="card-body">
										<small className="text-secondary">Sales by Location (Last 7 Days)</small>
										<div className="row">
											<div className="col-8">
												<div>
													<ComposableMap>
														<Geographies geography={geoUrl}>
															{({ geographies }) =>
																geographies.map((geo) => (
																	<Geography key={geo.rsmKey} geography={geo} />
																))
															}
														</Geographies>
													</ComposableMap>
												</div>
											</div>
											<div className="col-4 d-flex justify-content-center">
												<small>
													<p className="m-2 text-center">
														USA <br />$ 11,684
													</p>
													<p className="m-2 text-center">
														UK <br />$ 7,894
													</p>
													<p className="m-2 text-center">
														Germany <br />$ 3,395
													</p>
													<p className="m-2 text-center">
														Others <br />$ 6,684
													</p>
												</small>
											</div>
										</div>
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
