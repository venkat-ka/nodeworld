import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { Button} from 'react-bootstrap';
const Notification = (props) => {

    const [show, setShow] = React.useState(true);
        
    if (show) {
      return (
        <Alert variant={props.type} onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an Message!</Alert.Heading>
          <p>
            {props.message}
          </p>
        </Alert>
      );
    }
    
    return false;//<Button onClick={() => setShow(true)}>Show Alert</Button>;
}



export default Notification;