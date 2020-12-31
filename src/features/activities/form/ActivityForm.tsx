import { observer } from 'mobx-react-lite';
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import {v4 as uuid} from 'uuid'
import ActivityStore from '../../../app/stores/activityStore';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: InitialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState( {
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => InitialFormState && setActivity(InitialFormState)
      );
    }

    return ()=> {clearActivity();}
  },[loadActivity,clearActivity,match.params.id,InitialFormState,activity.id.length])  
 

  const handleSubmit = () => {
    console.log("Activity:" + activity);

    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(()=>history.push(`/activities/${activity.id}`));
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          rows={2}
          name="description"
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          type="datetime-local"
          name="date"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          loading={submitting}
          positive
          floated="right"
          content="Submit"
        />
        <Button
          onClick={()=>history.push('/activities')}
          floated="right"
          color="grey"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};


export default observer(ActivityForm)