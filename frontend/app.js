const getEmployees = async () => {
    const response = await fetch("http://localhost:3500/employees", {
       method: "GET"
    });
 
    if (!response.ok) {
      throw new Error(`Failed to get employees: ${response.statusText}`);
    }
 
    const data = await response.json();
    return data;
}

const getEmployeesByFirstname = async (firstname) => {
    console.log('getEmployeesByFirstname')
    const response = await fetch(`http://localhost:3500/employees/search?firstname=${firstname}`, {
       method: "GET"
    });
 
    if (!response.ok) {
      throw new Error(`Failed to get employees: ${response.statusText}`);
    }
 
    const data = await response.json();
    return data;
}

const getEmployeeById = async (id) => {
    if (!isNaN(id)) {
        const response = await fetch(`http://localhost:3500/employees/${id}`, {
            method: "GET"
        });

        if (!response.ok) {
        throw new Error(`Failed to get employees: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data;
    } else {
        return;
    }
}
 
const addEmployee = async (firstname, lastname, age, isMarried) => {
    const response = await fetch("http://localhost:3500/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
      },
      body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });
 
    if (!response.ok) {
      throw new Error(`Failed to add employee: ${response.statusText}`);
    }
 
    const data = await response.json(); // Returned employee data
    return data;
};
 
const updateEmployee = async (id, firstname, lastname, age, isMarried) => {
    const response = await fetch(`http://localhost:3500/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
      },
      body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });
 
    if (!response.ok) {
      throw new Error(`Failed to update employee: ${response.statusText}`);
    }
 
    const data = await response.json(); // Returned employee data
    return data;
};

const deleteEmployeesbyId = async (id) => {
    const response = await fetch(`http://localhost:3500/employees/${id}`, {
       method: "DELETE"
    });
 
    if (!response.ok) {
      throw new Error(`Failed to delete employees: ${response.statusText}`);
    }
}

$(async function () {
    let employees = await getEmployees();
    let viewEmployee = {};

    dataLoad();

    $(".search-bar button").on("click", async function () {
        const searchFirstName = $(".search-bar input").val().trim();
        console.log('searchFirstName', searchFirstName)
        employees = searchFirstName ? await getEmployeesByFirstname(searchFirstName) : await getEmployees();

        dataLoad();
    });

    $("#employee-list").on("click", ".btn-view", async function () {
        const id = $(this).data("id");
        console.log("Selected Employee ID:", id);

        try {
            viewEmployee = await getEmployeeById(id);
            console.log("Employee Data:", viewEmployee);

            $(".right").html(`
                <h2>View Employee/s Info</h2>
                <p><strong>First name:</strong> ${viewEmployee.firstname}</p>
                <p><strong>Last name:</strong> ${viewEmployee.lastname}</p>
                <p><strong>Age:</strong> ${viewEmployee.age}</p>
                <p><strong>Married:</strong> ${viewEmployee.isMarried ? "Yes" : "No"}</p>
            `);
        } catch (error) {
            console.error("Error fetching employee by ID:", error);
        }
    });

    $(".add-form button").on("click", async function () {
        const firstname = $(".add-form input[name='firstname']").val().trim();
        const lastname = $(".add-form input[name='lastname']").val().trim();
        const age = $(".add-form input[name='age']").val().trim();
        const isMarried = $(".add-form input[name='married']").prop("checked");

        if (!firstname || !lastname || !age) {
            alert("すべてのフィールドを入力してください！");
            return;
        }

        try {
            await addEmployee(firstname, lastname, age, isMarried);

            employees = await getEmployees();
            dataLoad();

            $(".add-form input").val("");
            $(".add-form input[name='married']").prop("checked", false);
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    })

    $("#employee-list").on("click", ".btn-edit", async function () {
        const id = $(this).data("id");
        console.log("Selected Employee ID:", id);

        try {
            const editEmployee = await getEmployeeById(id);
            console.log("Employee Data:", editEmployee);

            $(".edit-form").html(`
                <input type="hidden" name='id' value="${editEmployee.id}">
                <input type="text" name='firstname' value="${editEmployee.firstname}">
                <input type="text" name='lastname' value="${editEmployee.lastname}">
                <input type="number" name='age' value="${editEmployee.age}">
                <label class="checkbox">
                    Married? <input name='married' type="checkbox" ${editEmployee.isMarried ? checked : null}>
                </label>
                <button class="btn btn-update">Edit Employee</button>
            `);
        } catch (error) {
            console.error("Error fetching employee by ID:", error);
        }

    });

    $(".edit-form").on("click", ".btn-update", async function () {
        try {
            console.log('edit button')
            const id = $(".edit-form input[name='id']").val();
            const firstname = $(".edit-form input[name='firstname']").val().trim();
            const lastname = $(".edit-form input[name='lastname']").val().trim();
            const age = $(".edit-form input[name='age']").val().trim();
            const isMarried = $(".edit-form input[name='married']").prop("checked");

            if (!firstname || !lastname || !age) {
                alert("すべてのフィールドを入力してください！");
                return;
            }

            await updateEmployee(id, firstname, lastname, age, isMarried);
            
            employees = await getEmployees();
            dataLoad();
    
            $(".edit-form").empty();
        } catch (error) {
            console.error("Error update employee:", error);
        }
    })

    $("#employee-list").on("click", ".btn-delete", async function () {
        const id = $(this).data("id");
    
        try {
            await deleteEmployeesbyId(id);
    
            employees = await getEmployees();
            dataLoad();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    });

    async function dataLoad() {
        try {
            $("#employee-list").empty();

            console.log(employees);
            employees.forEach(emp => {
                $("#employee-list").append(`
                    <li>${emp.firstname} ${emp.lastname}
                        <button class="btn btn-view" data-id="${emp.id}">VIEW</button>
                        <button class="btn btn-edit" data-id="${emp.id}">EDIT</button>
                        <button class="btn btn-delete" data-id="${emp.id}">DELETE</button>
                    </li>
                `);
            });
        } catch (error) {
            console.error("Error in dataLoad:", error);
        }

    }
});