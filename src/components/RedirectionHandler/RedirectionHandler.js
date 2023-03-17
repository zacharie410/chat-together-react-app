import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectionHandler(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isLoggedIn && props.socketConnected) {
      navigate('/');
    } else if (!props.isLoggedIn) {
      navigate('/login');
    }
  }, [props.isLoggedIn, props.socketConnected, navigate]);

  return null;
}

export default RedirectionHandler;
