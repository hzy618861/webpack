import React,{Component} from 'react'
export default class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            title:"前端22222qq"
        }
    }
    render(){
        return (
            <div>
                <h2>{this.state.title}</h2>
            </div>
        )
    }
}