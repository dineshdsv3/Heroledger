import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
	const [image, setImage] = useState('');
	const [base64Image, setbase64Image] = useState('');

	const user = JSON.parse(localStorage.getItem('user'));
	console.log(image);

	useEffect(() => {
		getImage();
	}, []);

	const getImage = async () => {
		let email = user.email;
		await axios.get('/getImage', { params: { email } }).then((res) => {
			setImage(res.data.data[0].image);
		});
	};

	const handleUpload = (e) => {
		let result;
		let file = e.target.files[0];

		if (file) {
			if (file.size > 1148576) {
				alert('In Beta version you need to upload file less than 1 MB');
			} else {
				let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = async () => {
					result = reader.result;
					setImage(file);
					setbase64Image(result);
				};
			}
		}
	};

	const uploadImage = () => {
		const formData = new FormData();
		formData.append('image', image);

		axios.post('/addUpload', formData).then((res) => {
			console.log(res.data.file.filename);
			if (image) {
				console.log('uploading');
				let updatedUser = {
					email: user.email,
					image: res.data.file.filename,
				};
				console.log(updatedUser);
				axios
					.post('/imageUpload', { updatedUser })
					.then((res) => {
						console.log(res);
						alert('Upload successful!!!');
					})
					.catch((error) => {
						alert('Upload not successful!!! Please Try again');
					});
			} else {
				alert('Please select an image');
			}
		});

		console.log('triggered');
	};

	return (
		<div className="container">
			<div className="col-xl-10 col-lg-9 pt-5 mt-5 ml-auto">
				<div className="row">
					<div className="col-2 pt-3">
						<div className="row d-flex justify-content-center">
							<div className="col-12">
								<img
									className="rounded-circle mx-auto d-block"
									src={base64Image ? base64Image : `/image/${image}`}
									width="90"
									height="90"
								/>
							</div>
							<div className="col-12 mt-2">
								<div className="row justify-content-between">
									<div className="col-6">
										<label htmlFor="image" className="btn-primary profile-btn ">
											<small>Upload</small>
										</label>
										<input
											type="file"
											id="image"
											name="image"
											accept="image/*"
											onChange={handleUpload}
											hidden
										/>
									</div>
									<div className="col-6">
										<button className="btn-info profile-btn" onClick={uploadImage}>
											<small>Confirm</small>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-10 pt-3 mb-2">
						<h5 className="text-primary">{user.name}</h5>
						<div className="text-secondary">
							<i className="fa fa-map-marker" aria-hidden="true"></i> &nbsp; New York, NY
						</div>
						<div className="mt-3 mb-2">
							<h6>Rating</h6>
							<img src={require('../Assets/Images/stars.jpeg')} width="100" height="30" />
							<span className="text-secondary"> 4.89 | 14 Ratings</span>
						</div>
						<div className="mt-4">
							<h6>
								About <hr className="text-secondary" />
							</h6>
							<div>
								<div className="m-1 p-1">
									<span className="text-secondary">
										CONTACT INFORMATION &nbsp; &nbsp;<i className="fas fa-edit"></i>
									</span>
									<div className="row">
										<div className="col-2">
											<small>Phone:</small>
										</div>
										<div className="col-10">
											<small>+91 99999 99999</small>
										</div>
									</div>
									<div className="row">
										<div className="col-2">
											<small>Address:</small>
										</div>
										<div className="col-10">
											<small>House No., Street, Locality, State, Country</small>
										</div>
									</div>
									<div className="row">
										<div className="col-2">
											<small>Email:</small>
										</div>
										<div className="col-10">
											<small>{user.email}</small>
										</div>
									</div>
								</div>
								<div className="m-1 p-1">
									<span className="text-secondary mt-2">BASIC INFORMATION</span>
									<div className="row">
										<div className="col-2">
											<small>DOB:</small>
										</div>
										<div className="col-10">
											<small>03-03-1995</small>
										</div>
									</div>
									<div className="row">
										<div className="col-2">
											<small>Gender:</small>
										</div>
										<div className="col-10">
											<small>Male</small>
										</div>
									</div>
								</div>
								<div className="m-1 p-1">
									<span className="text-secondary mt-2">LOGIN INFORMATION</span>
									<div className="row">
										<div className="col-2">
											<small>User Name:</small>
										</div>
										<div className="col-10">
											<small>{user.name}</small>
										</div>
									</div>
									<div className="row">
										<div className="col-2">
											<small>Password:</small>
										</div>
										<div className="col-10">
											<small>********</small>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
