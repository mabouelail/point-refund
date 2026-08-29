const selections = {
    pointsLost: "Yes",
    duplicateTicket: "No",
    proofType: "Chat",
    trackCheck: "Was at Point A",
    reason: "Skipping",
    decision: "restore",
    points: "2"
};

const STORAGE_KEY = "pointRefundSelections";


// ==================================================
// LOAD SAVED SELECTIONS
// ==================================================

chrome.storage.local.get(STORAGE_KEY, (result) => {

    const saved = result[STORAGE_KEY];

    if (saved) {

        Object.assign(selections, saved);

        // Restore text fields
        document.getElementById("proofOther").value =
            saved.proofOther || "";

        document.getElementById("trackOther").value =
            saved.trackOther || "";

        document.getElementById("reasonOther").value =
            saved.reasonOther || "";

        document.getElementById("duplicateTicketLink").value =
            saved.duplicateTicketLink || "";
    }

    applySelectionsToButtons();

    updateOtherInputs();

    updateDuplicateTicketField();

    updatePointsVisibility();
});


// ==================================================
// SAVE SELECTIONS
// ==================================================

function saveSelections() {

    chrome.storage.local.set({

        [STORAGE_KEY]: {

            ...selections,

            proofOther:
                document.getElementById("proofOther").value,

            trackOther:
                document.getElementById("trackOther").value,

            reasonOther:
                document.getElementById("reasonOther").value,

            duplicateTicketLink:
                document.getElementById(
                    "duplicateTicketLink"
                ).value
        }
    });
}


// ==================================================
// APPLY SELECTED BUTTONS
// ==================================================

function applySelectionsToButtons() {

    document
        .querySelectorAll(".option")
        .forEach(button => {

            const group =
                button.dataset.group;

            const value =
                button.dataset.value;

            button.classList.toggle(
                "selected",
                selections[group] === value
            );
        });
}


// ==================================================
// HANDLE OPTION BUTTONS
// ==================================================

document
    .querySelectorAll(".option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const group =
                    button.dataset.group;

                const value =
                    button.dataset.value;


                // ======================================
                // POINTS LOST → NO
                // ======================================

                if (
                    group === "pointsLost" &&
                    value === "No"
                ) {

                    selections.pointsLost =
                        "No";

                    selections.proofType =
                        "N/A";

                    selections.trackCheck =
                        "N/A";

                    selections.reason =
                        "N/A";

                    selections.decision =
                        "no_points_deducted";


                    applySelectionsToButtons();

                    updateOtherInputs();

                    updatePointsVisibility();

                    saveSelections();

                    return;
                }


                // ======================================
                // POINTS LOST → YES
                // ======================================

                if (
                    group === "pointsLost" &&
                    value === "Yes"
                ) {

                    selections.pointsLost =
                        "Yes";

                    selections.proofType =
                        "Chat";

                    selections.trackCheck =
                        "Was at Point A";

                    selections.reason =
                        "Skipping";

                    selections.decision =
                        "restore";


                    applySelectionsToButtons();

                    updateOtherInputs();

                    updatePointsVisibility();

                    saveSelections();

                    return;
                }


                // ======================================
                // NORMAL OPTION
                // ======================================

                selections[group] =
                    value;


                // Remove selection from same group
                document
                    .querySelectorAll(
                        `[data-group="${group}"]`
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                // Select clicked button
                button.classList.add(
                    "selected"
                );


                // Duplicate ticket field
                if (
                    group ===
                    "duplicateTicket"
                ) {

                    updateDuplicateTicketField();
                }


                // Other fields
                updateOtherInputs();


                // Points visibility
                if (
                    group ===
                    "decision"
                ) {

                    updatePointsVisibility();
                }


                saveSelections();

            }
        );

    });


// ==================================================
// DUPLICATE TICKET LINK FIELD
// ==================================================

function updateDuplicateTicketField() {

    const container =
        document.getElementById(
            "duplicateLinkContainer"
        );


    if (
        selections.duplicateTicket ===
        "Yes"
    ) {

        container.classList.add(
            "visible"
        );

    } else {

        container.classList.remove(
            "visible"
        );
    }
}


// ==================================================
// OTHER INPUT FIELDS
// ==================================================

function updateOtherInputs() {

    const proofInput =
        document.getElementById(
            "proofOther"
        );

    const trackInput =
        document.getElementById(
            "trackOther"
        );

    const reasonInput =
        document.getElementById(
            "reasonOther"
        );


    proofInput.classList.toggle(
        "visible",
        selections.proofType ===
            "Other"
    );


    trackInput.classList.toggle(
        "visible",
        selections.trackCheck ===
            "Other"
    );


    reasonInput.classList.toggle(
        "visible",
        selections.reason ===
            "Other"
    );
}


// ==================================================
// POINTS VISIBILITY
// ==================================================

function updatePointsVisibility() {

    const pointsSection =
        document.getElementById(
            "pointsSection"
        );


    if (
        selections.pointsLost ===
            "No" ||
        selections.decision !==
            "restore"
    ) {

        pointsSection.style.display =
            "none";

    } else {

        pointsSection.style.display =
            "block";
    }
}


// ==================================================
// GET FINAL VALUE
// ==================================================

function getFinalValue(
    group,
    inputId
) {

    if (
        selections[group] ===
        "Other"
    ) {

        const value =
            document
                .getElementById(
                    inputId
                )
                .value
                .trim();


        return value || "Other";
    }


    return selections[group];
}


// ==================================================
// GENERATE & COPY
// ==================================================

document
    .getElementById(
        "generateButton"
    )
    .addEventListener(
        "click",
        async () => {

            const proofType =
                getFinalValue(
                    "proofType",
                    "proofOther"
                );


            const trackCheck =
                getFinalValue(
                    "trackCheck",
                    "trackOther"
                );


            const reason =
                getFinalValue(
                    "reason",
                    "reasonOther"
                );


            const duplicateTicketLink =
                document
                    .getElementById(
                        "duplicateTicketLink"
                    )
                    .value
                    .trim();


            // ==========================================
            // DECISION TEXT
            // ==========================================

            let decisionText;


            if (
                selections.decision ===
                "restore"
            ) {

                decisionText =
                    `Restore ${selections.points} points`;

            } else if (
                selections.decision ===
                "no_points_deducted"
            ) {

                decisionText =
                    "No points deducted";

            } else {

                decisionText =
                    "Do not restore";
            }


            // ==========================================
            // BUILD COMMENT
            // ==========================================

            let comment =
`Points lost: ${selections.pointsLost}
Duplicate ticket: ${selections.duplicateTicket}`;


            // Add duplicate link only when applicable
            if (
                selections.duplicateTicket ===
                    "Yes" &&
                duplicateTicketLink
            ) {

                comment +=
                    `\nDuplicate ticket link: ${duplicateTicketLink}`;
            }


            comment +=
`\nProof type: ${proofType}
Track check: ${trackCheck}
Reason for lost points: ${reason}
Decision: ${decisionText}`;


            // ==========================================
            // COPY
            // ==========================================

            try {

                await navigator.clipboard.writeText(
                    comment
                );


                saveSelections();


                const status =
                    document.getElementById(
                        "status"
                    );


                status.textContent =
                    "✓ Copied to clipboard";


                setTimeout(
                    () => {

                        status.textContent =
                            "";

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    error
                );


                document.getElementById(
                    "status"
                ).textContent =
                    "Could not copy comment.";
            }

        }
    );


// ==================================================
// SAVE TEXT WHILE TYPING
// ==================================================

document
    .getElementById(
        "proofOther"
    )
    .addEventListener(
        "input",
        saveSelections
    );


document
    .getElementById(
        "trackOther"
    )
    .addEventListener(
        "input",
        saveSelections
    );


document
    .getElementById(
        "reasonOther"
    )
    .addEventListener(
        "input",
        saveSelections
    );


document
    .getElementById(
        "duplicateTicketLink"
    )
    .addEventListener(
        "input",
        saveSelections
    );

document
    .getElementById("clearDuplicateLink")
    .addEventListener("click", () => {

        document.getElementById(
            "duplicateTicketLink"
        ).value = "";

        saveSelections();

        document.getElementById(
            "duplicateTicketLink"
        ).focus();
    });