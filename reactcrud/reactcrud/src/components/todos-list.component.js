import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
const Todo = (props) => {
    
    
    return (<tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
            <br />
           <button onClick={ () =>
                    axios.delete('http://localhost:4000/todos/'+props.todo._id)
                        .then(() => props.deleteItem(props.todo._id))                    
                        .catch(err => console.log(err))
                }
    >Delete</button>
            
            
        </td>
    </tr>);
}

class TodosList extends Component {
    
    constructor(props) {
        super(props);

        this.todoList = this.todoList.bind(this);
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.state = {todos: []};
    }
    
    componentDidMount = () => {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    deleteItemHandler = (id) => {
        
        const updatedTodos = this.state.todos.filter(todo => todo._id !== id);
        
        return this.setState({todos: updatedTodos})
       }
    todoList = () => {
       
        //console.log(decl)
        //console.log(this.state.todos);
        if(this.state.todos){
           // alert('ffff')
            let decl = this.state.todos;
        }
        return this.state.todos.map(
            function(currentTodo, i){
            return <Todo todo={currentTodo}  key={i}   />;
        })
    }
    
    render() {
       // const oncl = this.ontodoDelete;
    //    this.state.todos.map((litit, ki)=>
    //    console.log(ki))
       
        return (
            <div>
            <h3>Todos List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }} >
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Responsible</th>
                        <th>Priority</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                this.state.todos.map((currentTodo, i) => 
                    {
                        return(<Todo todo={currentTodo}  key={i} deleteItem={this.deleteItemHandler} />) 
                    
                    }) 
                }
                 
                    
                </tbody>
            </table>
        </div>
        )
    }
}

export default TodosList;