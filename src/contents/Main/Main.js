import { Box } from "@mui/material";
import B2t from "../../Components/B2t/B2t";
import MaterialTuition from "../../Components/Calculator/MaterialTuition";

const Main = (props) => {
	return (
		<Box sx={{ minHeight: "100vh" }} id="home">
			<B2t show={props.show} />
			<MaterialTuition
				campus={props.campus}
				onSetCampus={props.onSetCampus}
			/>
		</Box>
	);
};

export default Main;
