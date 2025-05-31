import { useState } from "react";
import "./Family.css";

export default function Family() {
	const [familyMembers, setFamilyMembers] = useState([
		{ id: 1, firstName: "Ronnie", lastName: "Perez", dob: "10-08-1995" },
		{ id: 2, firstName: "Carmen", lastName: "Coldiron", dob: "10-13-2002" },
		{ id: 3, firstName: "Eric", lastName: "Dodd", dob: "07-16-2000" },
		{ id: 4, firstName: "Ethan", lastName: "Gleason", dob: "69-69-69" },
		{ id: 5, firstName: "Amelia", lastName: "Snow", dob: "08-24-2004" },
	]);

	// const removeMember = (id) => {
	// 	setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
	// };

	return (
		<div>
			<div className="Family-Container">
                <div>
                    <h2>Family Members:</h2>
                    <hr className="Family-hr" />
                </div>
				<div className="Family-Content-Container">
					<ul>
						{familyMembers.map((member) => (
							<li className="Family-Content-Card" key={member.id}>
								<div>
									<h4>
										Name: {member.firstName} {member.lastName}
									</h4>
								</div>
								<div>
									<h4>DOB: {member.dob}</h4>
								</div>
								<div className="Family-Remove-Button-Div">
									<button
										className="Family-Remove-Button"
										// onClick={() => removeMember(member.id)}
									>
										X
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className="Family-Content-Buttons">
					<button>Search Members</button>
				</div>
			</div>
		</div>
	);
}
