console.log("Hello World!");

let name = "Robyn Hoyt";
let hasDownloadedResume = false;
let downloadCount = 0;

function showGreeting(userName) {
    return "Hello, my name is " + userName + "! Welcome to my portfolio!"
}

function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function daysUntilDeadline(deadlineDate) {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffMs = deadline - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

$(document).ready(function () {
    console.log("DOM loaded");

    const navItems = [
        { text: "Summary", target: "#summary" },
        { text: "Skills", target: "#skills" },
        { text: "Projects", target: "#projects" },
        { text: "Education", target: "#education" },
        { text: "Experience", target: "#experience" },
        { text: "Contact", target: "#contact" }
    ];

    let skills = ["HTML", "CSS", "JavaScript", "Python", "Cybersecurity"];

    let projects = [
        {
            title: "Vehicle Repair System Diagram",
            description: "Entity Relationship Diagram representing a client and vehicle repair system.",
            deadline: new Date("2025-01-21"),
            imageURL: "CS_345_HW2_1.jpg"
        },
        {
            title: "Dental Appointment System Diagram",
            description: "Entity Relationship Diagram representing a dental appointment management system.",
            deadline: new Date("2025-01-21"),
            imageURL: "CS_345_HW2_2.jpg"
        },
        {
            title: "Ongoing JavaScript Portfolio Upgrade",
            description: "An ongoing project focused on improving my portfolio using advanced JavaScript features.",
            deadline: new Date("2026-03-30"),
            imageURL: null
        }
    ];

    const educationData = [
        ["Northern Arizona University", "Associate Degree", "2024", "2028"]
    ];

    const experienceData = [
        ["Student Project Work", "Class Assignments", "2024", "Present"]
    ];

    function renderNav() {
        $("#dynamicNav").empty();

        navItems.forEach(function (item) {
            $("#dynamicNav").append(`
                <li class="nav-item">
                    <a class="nav-link dynamic-link" href="${item.target}">${item.text}</a>
                </li>
            `);
        });
    }

    function renderGreeting() {
        $("#greetingMessage").text(getTimeGreeting() + "! " + showGreeting(name));
    }

    function updateDownloadCount() {
        $("#downloadCount").text(downloadCount);
    }

    function skillExists(skillName, callback) {
        const exists = skills.some(function (skill) {
            return skill.toLowerCase() === skillName.toLowerCase();
        });
        callback(exists);
    }

    function renderSkills(filteredSkills = skills) {
        $("#skillsContainer").empty();

        filteredSkills.forEach(function (skill) {
            const originalIndex = skills.findIndex(function (originalSkill) {
                return originalSkill === skill;
            });

            const skillCard = $(`
                <div class="col-6 col-md-4 col-lg-3 skill-item">
                    <div class="card text-center shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title mb-3 skill-name" data-index="${originalIndex}" style="cursor: pointer;">
                                ${skill}
                            </h5>
                            <button class="btn btn-danger btn-sm delete-skill" data-index="${originalIndex}">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).hide();

            $("#skillsContainer").append(skillCard);
            skillCard.fadeIn(300);
        });
    }

    function addSkill() {
        const newSkill = $("#skillInput").val().trim();

        if (newSkill === "") {
            alert("Please enter a Skill.");
            return;
        }

        skillExists(newSkill, function (exists) {
            if (exists) {
                alert("That skill already exists.");
            } else {
                skills.push(newSkill);
                renderSkills();
                $("#skillInput").val("");
            }
        });
    }

    function renderProjects() {
        $("#projectsContainer").empty();

        for (let i = 0; i < projects.length; i++) {
            const today = new Date();
            const deadline = projects[i].deadline;

            let status = "";
            if (deadline > today) {
                status = "Ongoing";
            } else {
                status = "Completed";
            }

            const daysLeft = daysUntilDeadline(deadline);

            let deadlineMessage = "";
            if (status === "Ongoing") {
                deadlineMessage = `${daysLeft} day(s) remaining`;
            } else {
                deadlineMessage = "Deadline has passed";
            }

            const imageHTML = projects[i].imageURL
                ? `<img src="${projects[i].imageURL}" class="card-img-top" alt="${projects[i].title}">`
                : "";
            $("#projectsContainer").append(`
                <div class="col-12 col-md-6 project-item">
                    <div class="card shadow-sm h-100 border-primary">
                        ${imageHTML}
                        <div class="card-body">
                            <h5 class="card-title">${projects[i].title}</h5>
                            <p class="card-text">${projects[i].description}</p>
                            <p class="card-text"><strong>Deadline:</strong> ${projects[i].deadline.toLocaleDateString()}</p>
                            <p class="card-text"><strong>Status:</strong> ${status}</p>
                            <p class="card-text"><strong>Timeline:</strong> ${deadlineMessage}</p>
                        </div>
                    </div>
                </div>
            `);
        }
    }

    function createTable(data, headers, containerId) {
        const table = $(`
            <table class="table table-striped table-bordered align-middle">
                <thead class="table-light">
                    <tr></tr>
                </thead>
                <tbody></tbody>
            </table>
        `);

        headers.forEach(function (header) {
            table.find("thead tr").append(`<th>${header}</th>`);
        });

        data.forEach(function (rowData) {
            let rowHTML = "<tr>";
            rowData.forEach(function (cellData) {
                rowHTML += `<td>${cellData}</td>`;
            });
            rowHTML +="</tr>";
            table.find("tbody").append(rowHTML);
        });

        $("#" + containerId).empty().append(table);
    }

    renderNav();
    renderGreeting();
    updateDownloadCount();
    renderSkills();
    renderProjects();

    createTable(
        educationData,
        ["School/University", "Degree", "Start Year", "End Year"],
        "educationTableContainer"
    );

    createTable(
        experienceData,
        ["Role", "Company/Organization", "Start Year", "End Year"],
        "experienceTableContainer"
    );

    $("#resumeBtn").on("click", function (e) {
        e.preventDefault();

        const resumeURL = $(this).attr("href");

        if (!hasDownloadedResume) {
            setTimeout(function () {
                alert("Your resume is downloaded successfully!");
                hasDownloadedResume = true;
                downloadCount++;
                updateDownloadCount();

                const tempLink = document.createElement("a");
                tempLink.href = resumeURL;
                tempLink.setAttribute("download", "");
                document.body.appendChild(tempLink);
                tempLink.click();
                tempLink.remove();
            }, 2000);
        } else {
            downloadCount++;
            updateDownloadCount();

            const tempLink = document.createElement("a");
            tempLink.href = resumeURL;
            tempLink.setAttribute("download", "");
            document.body.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();
        }
    });

    $("#addSkillBtn").on("click", function () {
        addSkill();
    });

    $("#skillInput").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        } else if (e.key === "Escape") {
            $("#skillInput").val("");
            $("#skillSearch").val("");
        }
    });

    $(document).on("click", ".delete-skill", function () {
        const skillIndex = $(this).data("index");
        const skillCard = $(this).closest(".skill-item");

        skillCard.slideUp(300, function () {
            skills.splice(skillIndex, 1);
            renderSkills();
        });
    });

    $(document).on("click", ".skill-name", function () {
        const skillIndex = $(this).data("index");
        const currentSkill = skills[skillIndex];
        const updatedSkill = prompt("Edit skill name:", currentSkill);

        if (updatedSkill === null) {
            return;
        }

        const trimmedSkill = updatedSkill.trim();

        if (trimmedSkill === "") {
            alert("Skill name cannot be empty.");
            return;
        }

        const duplicateSkill = skills.some(function (skill, index) {
            return skill.toLowerCase() === trimmedSkill.toLowerCase() && index !== skillIndex;
        });

        if (duplicateSkill) {
            alert("That skill already exists.");
            return;
        }

        skills[skillIndex] = trimmedSkill;
        renderSkills();
    });

    $("#skillSearch").on("input", function () {
        const searchValue = $(this).val().toLowerCase();

        const filteredSkills = skills.filter(function (skill) {
            return skill.toLowerCase().includes(searchValue);
        });

        renderSkills(filteredSkills);
    });

    $("#sortProjectsBtn").on("click", function () {
        projects.sort(function (a, b) {
            return a.deadline - b.deadline;
        });

        renderProjects();
    });

    $(document).on("click", ".dynamic-link", function (e) {
        e.preventDefault();

        const targetSection = $(this).attr("href");

        $("html, body").animate(
            {
                scrollTop: $(targetSection).offset().top - 70
            },
            600
        );
    });
});