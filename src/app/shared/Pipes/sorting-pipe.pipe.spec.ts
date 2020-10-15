import {SortingPipePipe} from './sorting-pipe.pipe';
import {Post} from '../../../environments/interface';


describe('SortingPipe', () => {
  const mokPosts: Post[] = [
    {
    title: `111`,
    text: `111`,
    id: '1',
    date: 3,
    complete: false,
    adminApprove: true
    },
    {
      title: `222`,
      text: `222`,
      id: '2',
      date: 4,
      complete: false,
      adminApprove: true
    }
  ];
  const post: Post = {
    title: `111`,
    text: `111`,
    id: '1',
    date: 3,
    complete: false,
    adminApprove: true
  };
  const pipe = new SortingPipePipe();
  const postEmpty: Post[] = [];
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return input arr if arr is empty', () => {
    expect(pipe.transform(postEmpty, true)).toEqual(postEmpty);
  });
  it('should return sort asc arr', () => {
    const resArr = pipe.transform(mokPosts, true);
    expect(resArr[0]).toEqual(post);
  });
  it('should return sort desc arr', () => {
    const resArr = pipe.transform(mokPosts, false);
    expect(resArr[1]).toEqual(post);
  });
});
