import { ArrowOutward } from "@mui/icons-material";
import Logo from "../../assets/images/icon.png";

const MaterialHeading = ({ campus }) => (
	<header className="fee-header">
		<div className="fee-header-inner">
			<a
				className="fee-brand"
				href="https://www.horizon.sa.edu.au/"
				aria-label="Horizon Christian School website"
			>
				<img src={Logo} alt="" />
				<span>
					<strong>Horizon</strong>
					<small>CHRISTIAN SCHOOL</small>
				</span>
			</a>
			<a
				className="fee-school-link"
				href={
					campus === 1
						? "https://clare.horizon.sa.edu.au/"
						: "https://balaklava.horizon.sa.edu.au/"
				}
			>
				School website <ArrowOutward fontSize="small" />
			</a>
		</div>
	</header>
);

export default MaterialHeading;
