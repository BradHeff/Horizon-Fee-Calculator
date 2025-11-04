import MaterialFooter from "../Components/Footer/MaterialFooter";
import MaterialHeading from "../Components/Heading/MaterialHeading";

const Layout = (props) => {
	return (
		<div>
			<MaterialHeading
				campus={props.campus}
				navbar={props.navbar}
				onSetToggle={props.onSetToggle}
				toggle={props.toggle}
			/>
			{props.children}
			<MaterialFooter />
		</div>
	);
};

export default Layout;
