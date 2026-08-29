// ==================================================
// POINT REFUND TOOL - GITHUB PAGES VERSION
// ==================================================

const STORAGE_KEY = "pointRefundSelections";


// ==================================================
// DEFAULT SELECTIONS
// ==================================================

const defaultSelections = {
    pointsLost: "Yes",
    duplicateTicket: "No",
    proofType: "Chat",
    trackCheck: "Was at Point A",
    reason: "Skipping",
    decision: "restore",
    points: "2",

    proofOther: "",
    trackOther: "",
    reasonOther: "",
    duplicateTicketLink: ""
};


// ==================================================
// LOAD SAVED DATA
// ==================================================

let selections = loadSelections();


function loadSelections() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            return {
                ...defaultSelections,
                ...JSON.parse(saved)
            };

        }

    } catch (error) {

        console.error(
            "Could not load saved selections:",
            error
        );

    }

    return {
        ...defaultSelections
    };
}


// ==================================================
// SAVE DATA
// ==================================================

function saveSelections() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(selections)
        );

    } catch (error) {

        console.error(
            "Could not save selections:",
            error
        );

    }
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
// RESTORE TEXT FIELDS
// ==================================================

function restoreTextFields() {

    const proofOther =
        document.getElementById("proofOther");

    const trackOther =
        document.getElementById("trackOther");

    const reasonOther =
        document.getElementById("reasonOther");

    const duplicateTicketLink =
        document.getElementById(
            "duplicateTicketLink"
        );


    if (proofOther) {

        proofOther.value =
            selections.proofOther || "";

    }


    if (trackOther) {

        trackOther.value =
            selections.trackOther || "";

    }


    if (reasonOther) {

        reasonOther.value =
            selections.reasonOther || "";

    }


    if (duplicateTicketLink) {

        duplicateTicketLink.value =
            selections.duplicateTicketLink || "";

    }
}


// ==================================================
// OTHER INPUT VISIBILITY
// ==================================================

function updateOtherInputs() {

    const proofInput =
        document.getElementById("proofOther");

    const trackInput =
        document.getElementById("trackOther");

    const reasonInput =
        document.getElementById("reasonOther");


    if (proofInput) {

        proofInput.classList.toggle(
            "visible",
            selections.proofType === "Other"
        );

    }


    if (trackInput) {

        trackInput.classList.toggle(
            "visible",
            selections.trackCheck === "Other"
        );

    }


    if (reasonInput) {

        reasonInput.classList.toggle(
            "visible",
            selections.reason === "Other"
        );

    }
}


// ==================================================
// DUPLICATE TICKET LINK
// ==================================================

function updateDuplicateTicketField() {

    const container =
        document.getElementById(
            "duplicateLinkContainer"
        );


    if (!container) {
        return;
    }


    if (
        selections.duplicateTicket === "Yes"
    ) {

        container.classList.add("visible");

    } else {

        container.classList.remove("visible");

    }
}


// ==================================================
// POINTS VISIBILITY
// ==================================================

function updatePointsVisibility() {

    const pointsSection =
        document.getElementById(
            "pointsSection"
        );


    if (!pointsSection) {
        return;
    }


    if (
        selections.pointsLost === "No" ||
        selections.decision !== "restore"
    ) {

        pointsSection.style.display =
            "none";

    } else {

        pointsSection.style.display =
            "block";

    }
}


// ==================================================
// POINTS LOST = NO
// ==================================================

function selectNoPointsLost() {

    selections.pointsLost = "No";

    selections.proofType = "N/A";

    selections.trackCheck = "N/A";

    selections.reason = "N/A";

    selections.decision =
        "no_points_deducted";


    applySelectionsToButtons();

    updateOtherInputs();

    updateDuplicateTicketField();

    updatePointsVisibility();

    saveSelections();
}


// ==================================================
// POINTS LOST = YES
// ==================================================

function selectPointsLost() {

    selections.pointsLost = "Yes";

    selections.proofType = "Chat";

    selections.trackCheck =
        "Was at Point A";

    selections.reason = "Skipping";

    selections.decision = "restore";


    applySelectionsToButtons();

    updateOtherInputs();

    updateDuplicateTicketField();

    updatePointsVisibility();

    saveSelections();
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


                // ==========================================
                // POINTS LOST
                // ==========================================

                if (
                    group === "pointsLost"
                ) {

                    if (value === "No") {

                        selectNoPointsLost();

                    } else {

                        selectPointsLost();

                    }

                    return;
                }


                // ==========================================
                // NORMAL SELECTION
                // ==========================================

                selections[group] =
                    value;


                // Remove selected state
                // from the same group

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


                // ==========================================
                // DUPLICATE TICKET
                // ==========================================

                if (
                    group ===
                    "duplicateTicket"
                ) {

                    updateDuplicateTicketField();

                }


                // ==========================================
                // DECISION
                // ==========================================

                if (
                    group === "decision"
                ) {

                    updatePointsVisibility();

                }


                // ==========================================
                // OTHER
                // ==========================================

                updateOtherInputs();


                saveSelections();

            }
        );

    });


// ==================================================
// GET FINAL VALUE
// ==================================================

function getFinalValue(
    group,
    inputId
) {

    if (
        selections[group] === "Other"
    ) {

        const input =
            document.getElementById(
                inputId
            );


        if (!input) {
            return "Other";
        }


        const value =
            input.value.trim();


        return value || "Other";
    }


    return selections[group];
}


// ==================================================
// GENERATE COMMENT
// ==================================================

function generateComment() {

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
            ?.value
            .trim() || "";


    // ==========================================
    // DECISION
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
    // COMMENT
    // ==========================================

    let comment =
`Points lost: ${selections.pointsLost}
Duplicate ticket: ${selections.duplicateTicket}`;


    // Add duplicate link
    // only when duplicate = Yes

    if (
        selections.duplicateTicket === "Yes"
        && duplicateTicketLink
    ) {

        comment +=
            `\nDuplicate ticket link: ${duplicateTicketLink}`;

    }


    comment +=
`\nProof type: ${proofType}
Track check: ${trackCheck}
Reason for lost points: ${reason}
Decision: ${decisionText}`;


    return comment;
}


// ==================================================
// COPY TO CLIPBOARD
// ==================================================

async function copyComment() {

    const comment =
        generateComment();


    try {

        await navigator.clipboard.writeText(
            comment
        );


        const status =
            document.getElementById(
                "status"
            );


        if (status) {

            status.textContent =
                "✓ Copied to clipboard";


            setTimeout(
                () => {

                    status.textContent =
                        "";

                },
                2000
            );

        }


    } catch (error) {

        console.error(
            "Clipboard error:",
            error
        );


        // Fallback for browsers
        // that block navigator.clipboard

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            comment;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try {

            document.execCommand(
                "copy"
            );


            const status =
                document.getElementById(
                    "status"
                );


            if (status) {

                status.textContent =
                    "✓ Copied to clipboard";


                setTimeout(
                    () => {

                        status.textContent =
                            "";

                    },
                    2000
                );

            }

        } catch (fallbackError) {

            console.error(
                "Copy failed:",
                fallbackError
            );


            const status =
                document.getElementById(
                    "status"
                );


            if (status) {

                status.textContent =
                    "Could not copy comment.";

            }

        }


        document.body.removeChild(
            textarea
        );

    }
}


// ==================================================
// GENERATE BUTTON
// ==================================================

const generateButton =
    document.getElementById(
        "generateButton"
    );


if (generateButton) {

    generateButton.addEventListener(
        "click",
        copyComment
    );

}


// ==================================================
// TEXT INPUTS - SAVE WHILE TYPING
// ==================================================

const proofOther =
    document.getElementById(
        "proofOther"
    );


if (proofOther) {

    proofOther.addEventListener(
        "input",
        () => {

            selections.proofOther =
                proofOther.value;

            saveSelections();

        }
    );

}


const trackOther =
    document.getElementById(
        "trackOther"
    );


if (trackOther) {

    trackOther.addEventListener(
        "input",
        () => {

            selections.trackOther =
                trackOther.value;

            saveSelections();

        }
    );

}


const reasonOther =
    document.getElementById(
        "reasonOther"
    );


if (reasonOther) {

    reasonOther.addEventListener(
        "input",
        () => {

            selections.reasonOther =
                reasonOther.value;

            saveSelections();

        }
    );

}


const duplicateTicketLink =
    document.getElementById(
        "duplicateTicketLink"
    );


if (duplicateTicketLink) {

    duplicateTicketLink.addEventListener(
        "input",
        () => {

            selections.duplicateTicketLink =
                duplicateTicketLink.value;

            saveSelections();

        }
    );

}


// ==================================================
// CLEAR DUPLICATE TICKET LINK
// ==================================================

const clearDuplicateLink =
    document.getElementById(
        "clearDuplicateLink"
    );


if (clearDuplicateLink) {

    clearDuplicateLink.addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "duplicateTicketLink"
                );


            if (input) {

                input.value = "";

                selections.duplicateTicketLink =
                    "";

                saveSelections();

                input.focus();

            }

        }
    );

}


// ==================================================
// INITIALIZE
// ==================================================

restoreTextFields();

applySelectionsToButtons();

updateOtherInputs();

updateDuplicateTicketField();

updatePointsVisibility();
