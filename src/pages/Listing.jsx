import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

const Listing = () => {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const auth = getAuth();
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);
			//console.log(docSnap.data());
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};

		fetchListing();
	}, [navigate, params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main className="Listing">
			<Swiper navigation={true} modules={[Navigation]} className="mySwiper">
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<img src={listing.imgUrls[index]} alt="" />
					</SwiperSlide>
				))}
			</Swiper>

			<div
				className="shareIconDiv"
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}
			>
				<img src={shareIcon} alt="" />
			</div>

			{shareLinkCopied && <p className="shareLinkCopied">Link copied!</p>}

			<div className="listingDetails">
				<p className="listingName">
					{listing.name} - $
					{listing.offer
						? listing.discountedPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						: listing.regularPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">
					For {listing.type === 'rent' ? 'Rent' : 'Sale'}
				</p>
				{listing.offer && (
					<p className="discountPrice">
						${listing.regularPrice - listing.discountedPrice}
					</p>
				)}

				<ul className="listingDetailsList">
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: '1 Bedroom'}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: '1 Bathroom'}
					</li>
					<li>{listing.parking && 'Parking Spot'}</li>
					<li>{listing.furnished && 'Furnished'}</li>
				</ul>

				<p className="listingLocationTitle">Location</p>
				<p>{listing.geolocation.lat}</p>
				<p>{listing.geolocation.lng}</p>

				<div className="leafletContainer">
					<MapContainer
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={13}
						scrollWheelZoom={false}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lng]}
						>
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div>

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton"
					>
						Contact Landlord
					</Link>
				)}
			</div>
		</main>
	);
};

export default Listing;
