import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';




const Todo = (props) => {
    
    
    return (<tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
            <br />
           <button onClick={ () =>
                    axios.delete('http://localhost:5000/api/'+props.todo._id)
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
       // this.offetid = this.offetid.bind(this);
       // this.limitid = this.limitid.bind(this);;
        
        
        this.todoList = this.todoList.bind(this);
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.state = {todos: [], totalrow:'',active:1,perpage:5};
    }
    
    componentDidMount = () => {
        let pagination="/1/"+this.state.perpage;
        let fullpaginate='pagination'+pagination;
        let activepg = 1;
        let perpage = this.state.perpage;
        let calnum = 0;
        let addone = 0;
        if(this.props.match.params.limitid && this.props.match.params.offetid)
        {
            pagination =  "/"+parseInt(this.props.match.params.offetid)+'/'+parseInt(this.props.match.params.limitid);
            fullpaginate = 'pagination'+pagination;
            activepg = parseInt(this.props.match.params.offetid);
            perpage = this.state.perpage;
        }
        
        axios.get('http://localhost:5000/api/'+fullpaginate)
            .then(response => {
                //console.log(response);
                
                calnum = Math.ceil(parseInt(response.data.totalobj.totnum)%perpage);
               
                if(calnum != 0){
                    addone = 1;  
                }
                Math.ceil(parseInt(response.data.totalobj.totnum)/perpage)
                
                console.log(response.data.totalobj.totnum);
                this.setState({ todos: response.data.todos, 
                     active: activepg,
                     totalrow:parseInt(response.data.totalobj.totnum/perpage)+addone
                        });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    deleteItemHandler = (id) => {
        
        const updatedTodos = this.state.todos.filter(todo => todo._id !== id);
        
        return this.setState({todos: updatedTodos})
       }
       onChangePage = (curnm) =>{
        //console.log(props);
        let perpage = this.state.perpage;
        let fullpaginate = '';
        let offnm = 1;
        let calnum = 0;
        let addone = 0;
        if(curnm>1)
        {  
            offnm = Number(curnm - 1) * perpage;
        }
        
        
        fullpaginate = 'pagination/'+offnm+'/'+perpage;
        
        axios.get('http://localhost:5000/api/'+fullpaginate)
        .then(response => {
            calnum = Math.ceil(parseInt(response.data.totalobj.totnum)%perpage);
                if(calnum != 0){
                    addone = 1;  
                }
            this.setState({ todos: response.data.todos, 
                 active: curnm,
                 totalrow:parseInt(response.data.totalobj.totnum),
                 totalrow:parseInt(response.data.totalobj.totnum/perpage)+addone
                    });
        })
        .catch(function (error){
            console.log(error);
        })
        
    }   
    todoList = () => {
        
        return this.state.todos.map(
            function(currentTodo, i){
            return <Todo todo={currentTodo}  key={i}   />;
        })
    }
    
    render() {
   
    let active = this.state.active;
   console.log(this.state.active+'deded');
    let items = [];
    for (let number = 1; number <= this.state.totalrow; number++) {
      items.push(
        <Pagination.Item key={number} onClick={()=>this.onChangePage(number, this.state.perpage)} active={number === active}>
          {number}
        </Pagination.Item>,
      );
    }

    
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
            <Pagination >{items}</Pagination>
            <br />
            <br />
            <br />

        </div>
        )
    }
}

export default TodosList;
