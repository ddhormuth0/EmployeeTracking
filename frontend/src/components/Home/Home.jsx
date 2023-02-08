import React from "react"

function Home() {
    return (
        <div>
            <div className="row justify-content-center mt-5">
                {/* Title For Home Page */}
                <div className="col-md-6">
                    <h1 className="mt-5">Welcome to the Employee Tracker</h1>
                </div>
            </div>
            {/* Information Section */}
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h3><strong><u>Problem to Solve</u></strong></h3>
                    <p>
                        Hello my name is Dawson Hormuth and I am a Computer Science and Mathematics (Double Major) at
                        Frostburg State University. One of my recent jobs was at Chick-fil-A in LaVale, Maryland as a
                        kitchen training leader. It was my job to oversee new hire training as well as uphold kitchen policies.
                        At the store, we had a journal system that records employee actions; these actions can be anything like good actions,
                        bad actions, or even general information on an employee. The journal system has many flaws: no way to see the total number of journals,
                        total number of bad journals, total number of good journals, and total number of information journals. It is hard to generate reports
                        or see improvement if we cannot have this information readily available. This website aims to fix that problem.
                    </p>
                    <h3><strong><u>Project Specifications</u></strong></h3>
                    <p>
                        All code can be found on my <a href="https://github.com/ddhormuth0/EmployeeTracking">github</a> page.
                    </p>
                    <h5><strong>Backend: MySQL</strong></h5>
                    <p>
                        All employee information is stored in a MySQL Server. There are three simple tables. The first table is the employee table
                        that stores all employees by first name, last name, and ID. The second table is the journals table. It houses the journals and their
                        information. The columns in the journal table are: the ID of employee who is receiving the journal, the ID of employee who is writing the journal,
                        the date of the journal, the type of journal (good, bad, or info), and the content of the journal. The final table holds the account information.
                    </p>
                    <h5><strong>API: Express</strong></h5>
                    <p>
                        The API for this project is a Express.js server. It implements data retrieval and insertion on the MySQL server.
                        It allows for backend password hashing and backend account authentication.
                    </p>
                    <h5><strong>Frontend: React</strong></h5>
                    <p>
                        React was a great way of easily displaying data that was retrieved from the backend. It implements get, post, and delete requests to the
                        API.
                    </p>
                    <h5><u>Notes</u></h5>
                    <p>
                        All employees names and journals are not real or from any actual companies.
                        Also, to avoid random manipulation of data by unwanted users, there is only one admin account that allows the insertion and deletion of
                        journals and employees. Without this account you may still see employee information, but manipulation is blocked. If you wish to
                        see how information is deleted or inserted please send me an email at <a href="mailto:dawson.hormuth0@gmail.com">dawson.hormuth0@gmail.com</a> and I can send the admin account to you.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home