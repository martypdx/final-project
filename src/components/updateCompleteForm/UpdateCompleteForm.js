import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { storage, db } from '../../services/firebase'; 

const completeImages = storage.ref('images');

class UpdateCompleteForm extends PureComponent {
  state = {
    name: this.props.name,
    date: '',
    description: '',
    location: '',
    image: '',
    id: '',
    share: false
  };
  
  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };
  
  handleSubmit = (event) => {
    event.preventDefault();

    this.props.toggle();
    
    const { elements } = event.target;
    const completed = { ...this.state };
    
    this.handleUpload(elements.image.files[0])
      .then(url => {
        completed.image = url;
        this.props.addCompletedGoal(completed);
      })
      .then(() => {
        this.props.delete(this.props.id);
      });

  };

  handleUpload(file) {
    const uploadTask = completeImages.child(db.ref('temp').push().key).put(file); 
  
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', () => {
      }, 
      reject, 
      () => {
        const downloadUrl = uploadTask.snapshot.downloadURL;
        resolve(downloadUrl);
      });
    }); 
  }
  
  handleToggle = () => {
    this.setState(prev => ({
      share: !prev.share
    }));
  };
  
  
 

  render() {
    const { date, description, location, share, image } = this.state;
    
  
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="date" >Date:
          <input required name="date" onChange={this.handleChange} value={date}/>
        </label>
        <label htmlFor="description" >Description:
          <input required name="description" onChange={this.handleChange} value={description}/>
        </label>
        <label htmlFor="location" >Location:
          <input required name="location" onChange={this.handleChange} value={location}/>
        </label>
        <div>
          <label htmlFor="image"> Add Picture:
            <input name="image" ref={(input) => { this.pictureInput = input; }} type="file"/>
            <img className="preview" src={image}/>
          </label>
        </div>
        <label htmlFor="share">
          <input name="share" type="checkbox" onChange={this.handleToggle} value={share}/>
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default connect (
  null,
  null
)(UpdateCompleteForm);