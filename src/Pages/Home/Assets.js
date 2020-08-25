import React, { useState } from 'react';

const productOptions = [
	{ id: 1, name: 'Character', value: 'character', type: 'image' },
	{ id: 2, name: 'Script', value: 'script', type: 'file' },
	{ id: 3, name: 'Logo', value: 'logo', type: 'image' },
];

function Assets() {
	const [productDetails, setProductDetails] = useState({
		name: '',
		description: '',
		terms: '',
		productType: '',
		upload: '',
		price: 0,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(productDetails);
	};

	return (
		<section>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
						<div className="row pt-5 mt-md-3 mb-5 ml-2">
							<button className="btn btn-primary" data-toggle="modal" data-target="#register-asset">
								New Asset
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Asset Registration Modal */}
			<div className="modal fade" id="register-asset">
				<div className="modal-dialog">
					<div className="modal-content asset-modal">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<h4 className="modal-title">Register your Asset</h4>
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
							</div>
							<div className="modal-body asset-modal-body">
								<div>
									<label htmlFor="name">Product Name</label>
									<input
										id="name"
										onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
										required
									/>
								</div>
								<div>
									<label htmlFor="description">Description</label>
									<textarea
										id="description"
										onChange={(e) =>
											setProductDetails({ ...productDetails, description: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label htmlFor="terms">Terms</label>
									<input
										id="terms"
										onChange={(e) =>
											setProductDetails({ ...productDetails, terms: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label htmlFor="productType">Product type</label>
									<select
										id="productType"
										name="productType"
										onChange={(e) =>
											setProductDetails({ ...productDetails, productType: e.target.value })
                                        }
                                        required
									>
										<option value="">Select an option</option>
										{productOptions.map((ele, ind) => (
											<option key={ele + ind} value={ele.value}>
												{ele.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label htmlFor="upload">Upload</label>
									<input
                                        type="file"
										id="upload"
										onChange={(e) =>
											setProductDetails({ ...productDetails, upload: e.target.value })
                                        }
                                        accept="*"
										required
									/>
								</div>
								<div>
									<label htmlFor="price">Price in USD</label>
									<input
										id="price"
										onChange={(e) =>
											setProductDetails({ ...productDetails, price: e.target.value })
										}
										required
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-success">
									Confirm
								</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* End of Modal */}
		</section>
	);
}

export default Assets;
