let applications = JSON.parse(localStorage.getItem("applications")) || [];

const form = document.getElementById("applicationForm");
const table = document.getElementById("applicationTable");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const application = {
        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        type: document.getElementById("type").value,
        platform: document.getElementById("platform").value,
        date: document.getElementById("dateApplied").value,
        status: document.getElementById("status").value
    };

    applications.push(application);

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    form.reset();

    renderApplications();
});

function renderApplications(){

    table.innerHTML = "";

    applications.forEach(app => {

        const row = `
        <tr>
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>${app.type}</td>
            <td>${app.platform}</td>
            <td>${app.date}</td>
            <td>
    <select onchange="updateStatus(${applications.indexOf(app)}, this.value)">
        <option value="Applied" ${app.status==="Applied"?"selected":""}>Applied</option>
        <option value="Interview" ${app.status==="Interview"?"selected":""}>Interview</option>
        <option value="Offer" ${app.status==="Offer"?"selected":""}>Offer</option>
        <option value="Rejected" ${app.status==="Rejected"?"selected":""}>Rejected</option>
    </select>
</td>
        </tr>
        `;

        table.innerHTML += row;

    });

    updateDashboard();
    updateAnalytics();
    updateInsights();
}

function updateDashboard(){
    document.getElementById("heroApps").textContent =
    applications.length;

document.getElementById("heroInterviews").textContent =
    applications.filter(a => a.status === "Interview").length;

document.getElementById("heroOffers").textContent =
    applications.filter(a => a.status === "Offer").length;
    const successRate =
applications.length === 0
? 0
: Math.round(
(
applications.filter(a => a.status === "Offer").length
/
applications.length
) * 100
);

document.getElementById("successRate").textContent =
successRate + "%";

    document.getElementById("totalApps").textContent =
        applications.length;

    document.getElementById("internships").textContent =
        applications.filter(a => a.type === "Internship").length;

    document.getElementById("jobs").textContent =
        applications.filter(a => a.type === "Job").length;

    document.getElementById("interviews").textContent =
        applications.filter(a => a.status === "Interview").length;

    document.getElementById("offers").textContent =
        applications.filter(a => a.status === "Offer").length;

    document.getElementById("rejections").textContent =
        applications.filter(a => a.status === "Rejected").length;

    document.getElementById("pending").textContent =
        applications.filter(a => a.status === "Applied").length;
}

function updateAnalytics(){

    const platformBox =
        document.getElementById("platformAnalytics");

    const roleBox =
        document.getElementById("roleAnalytics");

    const statusBox =
        document.getElementById("statusAnalytics");

    platformBox.innerHTML = "";
    roleBox.innerHTML = "";
    statusBox.innerHTML = "";

    const platforms = {};
    const roles = {};
    const statuses = {};

    applications.forEach(app => {

        platforms[app.platform] =
            (platforms[app.platform] || 0) + 1;

        roles[app.type] =
            (roles[app.type] || 0) + 1;

        statuses[app.status] =
            (statuses[app.status] || 0) + 1;

    });

    for(let key in platforms){
        platformBox.innerHTML +=
        `<li>${key}: ${platforms[key]}</li>`;
    }

    for(let key in roles){
        roleBox.innerHTML +=
        `<li>${key}: ${roles[key]}</li>`;
    }

    for(let key in statuses){
        statusBox.innerHTML +=
        `<li>${key}: ${statuses[key]}</li>`;
    }
}

function updateInsights(){

    const insightBox =
    document.getElementById("insightBox");

    if(applications.length === 0){

        insightBox.innerHTML = `
        <p>
        📊 Add application data to generate
        platform performance insights.
        </p>
        `;

        return;
    }

    const interviewPlatforms = {};

    applications.forEach(app => {

        if(
            app.status === "Interview" ||
            app.status === "Offer"
        ){

            interviewPlatforms[app.platform] =
            (interviewPlatforms[app.platform] || 0) + 1;

        }

    });

    let totalResponses = 0;

    for(let platform in interviewPlatforms){

        totalResponses += interviewPlatforms[platform];

    }

    let platformAnalysis = "";

    for(let platform in interviewPlatforms){

        const percentage = Math.round(
            (interviewPlatforms[platform] /
            totalResponses) * 100
        );

        platformAnalysis += `
        <p>
        📌 ${platform} generated
        <strong>${percentage}%</strong>
        of your positive responses.
        </p>
        `;
    }

    let bestPlatform = "N/A";
    let highest = 0;

    for(let platform in interviewPlatforms){

        if(interviewPlatforms[platform] > highest){

            highest = interviewPlatforms[platform];
            bestPlatform = platform;

        }

    }

    insightBox.innerHTML = `
        <h3>📈 Platform Performance Analysis</h3>

        <br>

        ${platformAnalysis}

        <br>

        <h3>💡 Recommendation</h3>

        <p>
        Based on your application history,
        <strong>${bestPlatform}</strong>
        is generating the highest response rate.
        Consider prioritizing this platform
        for future applications.
        </p>
    `;
}

renderApplications();
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {

    link.addEventListener('click', () => {

        navLinks.forEach(item =>
            item.classList.remove('active')
        );

        link.classList.add('active');

    });

});
function updateStatus(index, newStatus){

    applications[index].status = newStatus;

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    renderTable();
    updateDashboard();
    updateInsights();

}