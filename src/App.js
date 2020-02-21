import React from 'react';
const BASE_URL        = 'https://localhost:5001/api/';

class App extends React.Component {
    
    constructor() {
        super();
        this.state  = {
          todos : [],
          singleTodo:{},
          lastSearched:{}
        };
        this.getAll = this.getAll.bind(this);
        this.submitToDo = this.submitToDo.bind(this);
        this.getTodo    = this.getTodo.bind(this);
    }

    // Called when constructor is finished building component.
    componentDidMount() {
      this.getAll();
    }

    getAll() {    
         // Read from cache by key.
         let cachedItem = sessionStorage.getItem("MY_KEY");

         // As long as something was in the cache…
         if(cachedItem != null) {
         // Convert string back to JavaScript object.
         let cachedObj  = JSON.parse(cachedItem);
   
       // Store object on the state.
       this.setState({lastSearched:cachedObj});
       }

        const URL        = BASE_URL + 'todo';
        // This code gets data from the remote server.
        fetch(URL).then(response => response.json())

        // Data Retrieved.
        .then((data) => {
          let serverResponce = JSON.stringify(data)
          console.log(serverResponce)  
          this.setState({todos:data});
        })

        // Data Not Retrieved.
        .catch((error) => {
            alert(error);
        });         
    }

    submitToDo(e) {
      const description   = this.ToDo.value;
      const URL           = BASE_URL + 'todo';
      this.ToDo.value = ""; // Clear input.     
      fetch(URL, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              IsComplete:  false, // Set default to false.
              Description: description,
          })
      })
      // Response received.
      .then(response => response.json())
          // Data retrieved.
          .then(json => {
              alert(JSON.stringify(json));
              this.getAll();
          })
          // Data not retrieved.
          .catch(function (error) {
              alert(error);
          }) 
  }
  
  delete(id) {
    alert(id);
    const URL = BASE_URL + 'todo/MyDelete?Id=' + id;
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })        
        .then(response => response.json())
            // Data retrieved.
            .then(json => {
                alert(JSON.stringify(json));
                this.getAll();
            })
            // Data not retrieved.
            .catch(function (error) {
                alert(error);
            })             
}

updateToDo(id, checked) {
  const URL = BASE_URL + 'todo/MyEdit';

  fetch(URL, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          Id: id,
          IsComplete:  checked
      })
  })
  // Wait for response.   
  .then(response => response.json())
      // Data retrieved.
      .then(json => {
          alert(JSON.stringify(json));
          this.getAll();
      })
      // Data not retrieved.
      .catch(function (error) {
          alert(error);
      }) 
}

//get by single ID
getTodo(e) {
  alert(this.ToDoItem.value);
  let id = this.ToDoItem.value;

  const URL = BASE_URL + 'todo/' + id;
      fetch(URL, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
      })        
      .then(response => response.json())
          // Data retrieved.
          .then(json => {
            let strJSON = JSON.stringify(json);
            // Store string in cache.
            sessionStorage.setItem("MY_KEY", strJSON);  
            this.getAll(); // Refresh list and label.
              alert(JSON.stringify(json));
              this.setState({singleTodo : json});
          })
          // Data not retrieved.
          .catch(function (error) {
              alert(error);
          })             
}

    render() {
        return (          
            <div>
              <ul>
              {this.state.todos.map((item, index)=>(
                <li key={item.Id}>{index} {item.id} {item.description}    
                <input type='checkbox' value={item.isComplete}
                checked={item.isComplete} 
                onChange={(e) => this.updateToDo(item.id, e.target.checked)} />
                 <a href="#" onClick={(e) => this.delete(item.id)}>Delete</a>  </li>
              ))}
              </ul>         
              {/* Create new item */}
              <input type="text" ref={(toDoInput) => this.ToDo = toDoInput} />
              <button onClick={this.submitToDo}>Submit New Todo Description</button>          
 
             {/* Get item */}
            <br/><br/>
            <input type="text" ref={(getTodoInput) => this.ToDoItem = getTodoInput} />
            <button onClick={this.getTodo}>Get Todo By ID</button>  
            <br/>
            {this.state.singleTodo.id} {this.state.singleTodo.description} 
            { this.state.singleTodo.isComplete ?  ' - Completed.': '' }    
            { this.state.singleTodo.isComplete==false ?  ' - Not completed.':'' } 

            <br/><br/>
            <b>Last Searched</b><br/>
            {this.state.lastSearched.id?this.state.lastSearched.id:""} &nbps;&nbsp;
            {this.state.lastSearched.description?this.state.lastSearched.description:""}
            </div>     
        )
    }
}

export default App;
