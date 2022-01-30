import CreateSubscriberDto from './dto/createSubscriber.dto';

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<any>;
  getAllSubscribers(params: {}): Promise<any>;
}

export default SubscribersService;
