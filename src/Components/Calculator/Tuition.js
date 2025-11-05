import { useCallback, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import FooterStyle from "../../Styles/StyleFooter";
import { formatDollars } from "../Objects/Currancy";
import CalculatorControls from "./CalculatorControls";
import {
	busFee,
	concessionFee,
	concessionFeeClare,
	staffDiscountPercentage,
	standardCosts,
	standardCostsClare,
	yearLevels,
} from "./Constants";
import FeeOutcomeTable from "./FeeOutcomeTable";
import StaffDiscount from "./StaffDiscount";
import YearLevelSelector from "./YearLevelSelector";

const Tuition = (props) => {
	const [children, setChildren] = useState([""]);
	const [hasConcessionCard, setHasConcessionCard] = useState(false);
	const [hasBusFee, setHasBusFee] = useState(false);
	const [total, setTotal] = useState(0);
	const totalRef = useRef(null);
	const [showDropdowns, setShowDropdowns] = useState([true, false, false]);
	const [sortedChildren, setSortedChildren] = useState([]);

	const [newDropdowns, setNewDropdowns] = useState([]);
	const [isStaffDiscount, setIsStaffDiscount] = useState(false);
	// Add this useEffect to recalculate total when campus changes
	// Add a new state for campus
	const [campus, setCampus] = useState(props.campus);

	const getClearLevy = (yearLevel) => {
		if (["foundation", "year1", "year2", "year3"].includes(yearLevel)) {
			return 100;
		} else if (["year4", "year5", "year6"].includes(yearLevel)) {
			return 250;
		} else {
			return 500;
		}
	};

	const addChild = () => {
		setChildren([...children, ""]);
		setShowDropdowns((prevState) => {
			const newState = [...prevState, false];
			return newState;
		});
		setNewDropdowns((prevState) => [...prevState, true]);
		// Use setTimeout to delay the animation
		setTimeout(() => {
			setShowDropdowns((prevState) => {
				const newState = [...prevState];
				newState[children.length] = true;
				return newState;
			});
		}, 50);
	};

	const updateChildYear = (year, index) => {
		const newChildren = [...children];
		newChildren[index] = year;
		setChildren(newChildren);
		const sorted = calculateTotal(
			newChildren,
			hasConcessionCard,
			hasBusFee
		);
		setSortedChildren(sorted);

		// Mark the dropdown as no longer new
		setNewDropdowns((prevState) => {
			const newState = [...prevState];
			newState[index] = false;
			return newState;
		});
	};

	const calculateTotal = useCallback(
		(childrenYears, concession, bus, staffDiscount) => {
			let newTotal = 0;
			const sortedChildren = [...childrenYears]
				.filter(Boolean)
				.sort((a, b) => yearLevels.indexOf(b) - yearLevels.indexOf(a));

			sortedChildren.forEach((year, index) => {
				if (year) {
					// Only first 3 children get tuition fees
					if (index < 3) {
						let costs = concession
							? (campus === 0
									? concessionFee
									: concessionFeeClare)[year]
							: (campus === 0
									? standardCosts
									: standardCostsClare)[year];
						// Apply staff discount if applicable
						if (staffDiscount && !concession) {
							costs = costs.map(
								(cost) => cost * staffDiscountPercentage
							);
						}

						newTotal += costs[Math.min(index, 2)] || 0;
					}

					// All children get resource fees (levy)
					newTotal += getClearLevy(year);
				}

				// Only first 3 children get bus fees
				if (bus && index < 3) {
					if (index === 0) newTotal += busFee.child1;
					else if (index === 1) newTotal += busFee.child2;
					else if (index === 2) newTotal += busFee.child3;
				}
			});

			setTotal(newTotal);
			return sortedChildren;
		},
		[campus]
	);

	const handleConcessionChange = (e) => {
		if (!isStaffDiscount) {
			setHasConcessionCard(e.target.checked);
			calculateTotal(children, e.target.checked, hasBusFee);
		} else {
			setHasConcessionCard(false);
		}
	};

	const handleBusFeeChange = (e) => {
		setHasBusFee(e.target.checked);
		calculateTotal(children, hasConcessionCard, e.target.checked);
	};
	const resetCalculator = () => {
		setChildren([""]);
		setHasConcessionCard(false);
		setHasBusFee(false);
		setIsStaffDiscount(false);
		setTotal(0);
		setSortedChildren([]);
		setShowDropdowns([true, false, false]);
		setNewDropdowns([false]);

		calculateTotal([""], false, false, false);
	};
	const getOrdinalSuffix = (i) => {
		const j = i % 10,
			k = i % 100;
		if (j === 1 && k !== 11) {
			return "st";
		}
		if (j === 2 && k !== 12) {
			return "nd";
		}
		if (j === 3 && k !== 13) {
			return "rd";
		}
		return "th";
	};
	const animatedProps = useSpring({
		total: total,
		from: { total: 0 },
		onRest: () => {
			if (totalRef.current) {
				totalRef.current.classList.add("pop-effect");
				setTimeout(() => {
					if (totalRef.current) {
						totalRef.current.classList.remove("pop-effect");
					}
				}, 300);
			}
		},
	});
	// Add this useEffect to call onSetCampus when local state changes
	const handleCampusChange = (newCampus) => {
		setCampus(newCampus);
		props.onSetCampus(newCampus);
	};

	const handleStaffDiscountChange = (e) => {
		setIsStaffDiscount(e.target.checked);
		if (hasConcessionCard) {
			setHasConcessionCard(false);
		}
		calculateTotal(
			children,
			hasConcessionCard,
			hasBusFee,
			e.target.checked
		);
	};

	useEffect(() => {
		setCampus(props.campus || 0);
	}, [props.campus]);

	useEffect(() => {
		calculateTotal(children, hasConcessionCard, hasBusFee, isStaffDiscount);
	}, [
		calculateTotal,
		campus,
		children,
		hasBusFee,
		hasConcessionCard,
		isStaffDiscount,
	]);

	return (
		<div className="section section-lg">
			<div className="container h-100">
				<div className="row align-items-center h-100">
					<div className="col-12 mb-4">
						<div className="card shadow-lg p-4">
							<div className="card-body">
								<h3 className="title text-center mb-3">
									Change Campus
								</h3>
								<h4 className="text-center m-0 p-0">
									Current:{" "}
									<span
										className="text-success"
										style={{ fontWeight: 700 }}
									>
										{campus === 0 ? "Balaklava" : "Clare"}
									</span>
								</h4>
								<div className="d-flex justify-content-center mt-3">
									<button
										className={`btn ${
											campus === 0
												? "btn-primary"
												: "btn-outline-primary"
										} me-2`}
										onClick={() => handleCampusChange(0)}
									>
										Balaklva Campus
									</button>
									<button
										className={`btn ${
											campus === 1
												? "btn-primary"
												: "btn-outline-primary"
										}`}
										onClick={() => handleCampusChange(1)}
									>
										Clare Campus
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row equal-height-row justify-content-center">
					<CalculatorControls
						YearLevelSelector={YearLevelSelector}
						children={children}
						showDropdowns={showDropdowns}
						newDropdowns={newDropdowns}
						hasConcessionCard={hasConcessionCard}
						updateChildYear={updateChildYear}
						addChild={addChild}
						handleConcessionChange={handleConcessionChange}
						handleBusFeeChange={handleBusFeeChange}
						hasBusFee={hasBusFee}
						resetCalculator={resetCalculator}
					/>

					<FeeOutcomeTable
						getClearLevy={getClearLevy}
						sortedChildren={sortedChildren}
						getOrdinalSuffix={getOrdinalSuffix}
						formatDollars={formatDollars}
						hasConcessionCard={hasConcessionCard}
						concessionFee={concessionFee}
						concessionFeeClare={concessionFeeClare}
						hasBusFee={hasBusFee}
						busFee={busFee}
						standardCosts={standardCosts}
						standardCostsClare={standardCostsClare}
						animatedProps={animatedProps}
						totalRef={totalRef}
						campus={campus}
						animated={animated}
						isStaffDiscount={isStaffDiscount}
					/>
				</div>
				<div className="row align-items-center justify-content-center h-100">
					<StaffDiscount
						handleStaffDiscountChange={handleStaffDiscountChange}
						isStaffDiscount={isStaffDiscount}
					/>
				</div>
				<FooterStyle />
			</div>
		</div>
	);
};

export default Tuition;
