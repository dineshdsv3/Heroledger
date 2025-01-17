import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import StoreHome from './StoreHome';
import CategoryComponent from './CategoryComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getContract } from '../../Redux/actions/contractAction';

function Store() {
	const [user, setUser] = useState({});
	const [characterData, setCharacterData] = useState([]);
	const [characterLoader, setCharacterLoader] = useState(true);
	const [scriptData, setScriptData] = useState([]);
	const [scriptLoader, setScriptLoader] = useState(true);
	const [logoData, setLogoData] = useState([]);
	const [logoLoader, setLogoLoader] = useState(true);
	const [backgroundData, setBackgroundData] = useState([]);
	const [backgroundLoader, setBackgroundLoader] = useState(true);
	const [videoData, setVideoData] = useState([]);
	const [videoLoader, setVideoLoader] = useState(true);
	const [audioData, setAudioData] = useState([]);
	const [audioLoader, setAudioLoader] = useState(true);
	const [propsData, setPropsData] = useState([]);
	const [propsLoader, setPropsLoader] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState('');
	const [check, setCheck] = useState(false);

	const contract = useSelector((state) => state.contract);
	const account = localStorage.getItem('account');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getContract());
	}, [dispatch]);

	useEffect(() => {
		getAllAssets();
	}, []);

	const getAllAssets = async () => {
		const user = await JSON.parse(localStorage.getItem('user'));
		setUser(user);
		// character
		axios.get('/getCharacterAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setCharacterData(resData);
			setCharacterLoader(false);
		});
		// Script
		axios.get('/getScriptAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setScriptData(resData);
			setScriptLoader(false);
		});
		// logo
		axios.get('/getLogoAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setLogoData(resData);
			setLogoLoader(false);
		});
		// background
		axios.get('/getBackgroundAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setBackgroundData(resData);
			setBackgroundLoader(false);
		});
		// audio
		axios.get('/getAudioAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setAudioData(resData);
			setAudioLoader(false);
		});
		// video
		axios.get('/getVideoAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setVideoData(resData);
			setVideoLoader(false);
		});
		// props
		axios.get('/getPropsAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			setPropsData(resData);
			setPropsLoader(false);
		});
	};

	const purchaseProduct = async (productId, buyerEmail, price) => {
		console.log(productId, buyerEmail, price, account);
		console.log(contract.state);
		await contract.state.methods
			.purchaseProduct(productId, buyerEmail)
			.send({ from: account, value: price })
			.once('receipt', (receipt) => {
				const BCData = receipt.events.productPurchased;
				// console.log(BCData);
				const returnData = receipt.events.productPurchased.returnValues;
				// console.log(returnData);
				const updatedProduct = {
					productId: returnData.productId,
					ownerAddress: returnData.ownerAddress,
					ownerEmail: returnData.ownerEmail,
					inStore: returnData.inStore,
					timestamp: returnData.timestamp,
					transactionHash: BCData.transactionHash,
				};
				const transactionDetails = {
					productId: returnData.productId,
					productName: returnData.productName,
					transactionHash: BCData.transactionHash,
					transactionType: 'Purchase',
					previousOwner: returnData.seller,
					currentOwner: returnData.ownerEmail,
					purchaseDate: returnData.timestamp,
					amountinEth: returnData.amount,
					registrationDate: returnData.registrationDate,
				};
				console.log(transactionDetails);
				axios
					.put('/purchaseProduct', { updatedProduct })
					.then((res) => {
						axios.post('/addTransaction', { transactionDetails }).then((res) => {
							console.log(res);
							alert('Purchase Succesfful, Product added to your account');
							window.location.reload();
						});
					})
					.catch((error) => {
						alert('Purchase not successful, Please try again');
					});
			});
	};

	const purchaseLicense = async (productId, licensee, licenseFee, endDate) => {
		var d = new Date();
		var date = d.getDate();
		// console.log(date);
		var currentTime = moment(d).format('X');

		console.log(productId, licensee, licenseFee, currentTime);
		if (currentTime <= endDate) {
			await contract.state.methods
				.purchaseLicense(productId, licensee)
				.send({ from: account, value: licenseFee })
				.once('receipt', (receipt) => {
					// console.log(receipt);
					const BCData = receipt.events.licensePurchased;
					const returnData = receipt.events.licensePurchased.returnValues;
					const updatedLicense = {
						productId: returnData.productId,
						endDate: returnData.endDate,
						startDate: returnData.startDate,
						license: returnData.license,
						licenseeMail: returnData.licenseeMail,
						licensorMail: returnData.licensorMail,
						term2: 'N/A',
						transactionHash: BCData.transactionHash,
						timestamp: returnData.timestamp,
						ownerAddress: returnData.ownerAddress,
					};
					console.log('License Update purchased');
					console.log(BCData);
					console.log(returnData);
					const transactionDetails = {
						productId: returnData.productId,
						productName: returnData.productName,
						transactionHash: BCData.transactionHash,
						transactionType: 'license',
						previousOwner: returnData.licensorMail,
						currentOwner: returnData.licenseeMail,
						purchaseDate: returnData.timestamp,
						amountinEth: returnData.amount,
						registrationDate: returnData.registrationDate,
					};
					axios
						.put('/purchaseLicense', { updatedLicense })
						.then((res) => {
							axios.post('/addTransaction', { transactionDetails }).then((res) => {
								console.log(res);
								alert('License Purchase Succesfful, Product added to your account');
								window.location.reload();
							});
						})
						.catch((error) => {
							alert('Purchase not successful, Please try again');
						});
				});
		} else {
			alert('license expired for the selected product');
		}
	};

	return (
		<div className="store-bg">
			<StoreHome />
			<div className="col-xl-10 col-lg-9 col-md-8 store-page pt-5 ml-auto">
				{/* Characters */}
				<div className="my-5 py-2">
					<CategoryComponent
						loader={characterLoader}
						data={characterData}
						user={user}
						header={'Characters'}
						image={require('../../Assets/Images/Shop_Char.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of characters section */}
				{/* Logos */}
				<div className="my-3">
					<CategoryComponent
						loader={logoLoader}
						data={logoData}
						user={user}
						header={'Logos'}
						image={require('../../Assets/Images/Shop_logo.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Logos */}

				{/* Scripts */}
				<div className="my-3">
					<CategoryComponent
						loader={scriptLoader}
						data={scriptData}
						user={user}
						header={'Scripts'}
						image={require('../../Assets/Images/Shop_script.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Scripts */}

				{/* Backgrounds */}
				<div className="my-3">
					<CategoryComponent
						loader={backgroundLoader}
						data={backgroundData}
						user={user}
						header={'Backgrounds'}
						image={require('../../Assets/Images/Shop_BG.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Backgrounds */}

				{/* Audios */}
				<div className="my-3">
					<CategoryComponent
						loader={audioLoader}
						data={audioData}
						user={user}
						header={'Audios'}
						image={require('../../Assets/Images/Shop_AV.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Audios */}

				{/* Videos */}
				<div className="my-3">
					<CategoryComponent
						loader={videoLoader}
						data={videoData}
						user={user}
						header={'Videos'}
						image={require('../../Assets/Images/Shop_AV.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Videos */}

				{/* Props */}
				<div className="my-3">
					<CategoryComponent
						loader={propsLoader}
						data={propsData}
						user={user}
						header={'Props'}
						image={require('../../Assets/Images/Shop_Props.png')}
						selectedProduct={selectedProduct}
						setSelectedProduct={setSelectedProduct}
						check={check}
						setCheck={setCheck}
						purchaseProduct={purchaseProduct}
						purchaseLicense={purchaseLicense}
					/>
				</div>
				{/* End of Props */}

				{/* Modal-licensing terms */}
				<div className="modal licensing-modal" id="licensing-terms">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title ">LICENSING AGREEMENT</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="watermark">SAMPLE</div>
								<p>
									<b>
										<i>Asset Name:</i>
									</b>{' '}
									{selectedProduct.productName}
								</p>
								<p>
									<b>
										<i>Hash: </i>
									</b>
									{selectedProduct.transactionHash}
								</p>
								<p>
									This Artist Licensing Agreement (the “AGREEMENT”) is entered into effective this
									date, (date added here) between LICENSOR NAME (“ARTIST”) and LICENSEE (“CLIENT”).
								</p>
								<p>
									<b>Scope of this Agreement.</b> This Agreement applies to any image, graphics,
									digital assets, or digital images created or taken by Artist and delivered to the
									Client (collectively known as “IMAGES”). This Agreement governs the relationship
									between the parties and in no communication or other exchange, shall modify the
									terms of this Agreement unless agreed to in writing.
								</p>
								<p>
									<b>Rights:</b> All Images and rights relating to them, including copyright and
									ownership rights in the media in which the Images are stored, remain the sole and
									exclusive property of the Artist. This license provides the Client with the limited
									right to reproduce, publicly display, and distribute the Images only for the agreed
									upon terms as set forth in the Client Invoice and signed by both parties. Images
									used for any purpose not directly related outside of those terms must be with the
									express permission of Artist and may include the payment of additional fees, unless
									otherwise agreed to in writing. Images may contain copyright management information
									(CMI) at the discretion of the Artist in the form of either 1) a copyright notice ©
									and/or 2) other copyright and ownership information embedded in the metadata or
									elsewhere unless otherwise agreed to by the Parties. Removing and/or altering such
									information is prohibited and constitutes a violation of the Digital Millennium
									Copyright Act (DMCA) and Client will be responsible to the Artist for any penalties
									and awards available under that statute.
								</p>{' '}
								<p>
									{' '}
									<b>Relationship of the Parties:</b> The parties agree that Artist is an independent
									contractor and that neither Artist nor Artist’s employees or contract personnel are,
									or shall be deemed to be, employees of Client. No agency, partnership, joint
									venture, or employee-employer relationship is intended or created by this Agreement.
									Neither party is authorized to act as agent or bind the other party except as
									expressly stated in this Agreement. Artist and the Images or any other deliverables
									prepared by Artist shall not be deemed a work for hire as defined under Copyright
									Law. All rights granted to Client are contractual in nature and are expressly
									defined by this Agreement.
								</p>
								<p>
									<b>Creation:</b> The manner and method of creating any Image is solely at the
									discretion of Artist and the Client has no right to control Artist’s manner and
									method of performance under this Agreement. Artist will use his/her best efforts to:
									(a) ensure that the Images conform to Client’s specifications; and (b) submit all
									Images to Client in publishable quality, on or before the applicable deadlines.
								</p>
								<p>
									<b>Delivery:</b> Artist may select delivery of designs in PDF, JPEG, PNG, or other
									standard formats at a resolution that Artist determines will be suitable for the
									Images as licensed. It is the Client’s responsibility to verify that the Images are
									suitable for reproduction and that if the Images are not deemed suitable, to notify
									the Artist within five (5) business days. Artist’s sole obligation will be to
									replace the Images at a suitable resolution but in no event will Artist be liable
									for poor reproduction quality, delays, or consequential damages.
								</p>
							</div>
							<div className="modal-footer">
								<div className="mr-auto">
									<input type="checkbox" value={check} onChange={() => setCheck(!check)} /> {'    '}{' '}
									&nbsp;I have read and accept the terms and information contained in this license.
								</div>
								<button
									type="button"
									className="btn btn-success"
									disabled={!check}
									onClick={() =>
										purchaseLicense(
											selectedProduct.productId,
											user.email,
											selectedProduct.licenseFee,
											selectedProduct.term1EndDate
										)
									}
								>
									Proceed to purchase
								</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* End of Modal licensing terms */}
			</div>
		</div>
	);
}

export default Store;
