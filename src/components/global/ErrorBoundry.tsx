import React, { Component } from 'react'

class ErrorBoundry extends Component<{ children: any }, { hasError: boolean }> {

    constructor(props: any) {
        super(props)
    
        this.state = {
             hasError: false
        }
    }
    

    static getDerivedStateFromError(err: any){

        return {
            hasError: true
        }

    }

    componentDidCatch(err: any, info: any){
        console.log(err, 'logged error');
        console.log(info, 'logged error info');
    }

    render() {
        
        if(this.state.hasError){
            return <h1>Something went wrong</h1>
        }

        return this.props.children;
        
    }

}

export default ErrorBoundry
