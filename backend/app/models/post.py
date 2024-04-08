from . import db

class Post(db.Model):
    __tabelname__ = 'Post'
    post_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String(100), nullable=True)
    like_count = db.Column(db.Integer, nullable=True, default=0)

    def __init__(self, content, like_count):
        self.content = content
        self.like_count = like_count

    @staticmethod
    def get_all():
        return Post.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Post.query.get(id)
    
    @staticmethod
    def create(data):
        post = Post(content=data['content'],
                    like_count=data['like_count'])
        db.session.add(post)
        db.session.commit()
        return post
    
    @staticmethod
    def update(id, data):
        post = Post.query.get(id)
        post.content = data['content']
        post.like_count = data['like_count']
        db.session.commit()
        return post
    
    @staticmethod
    def delete(id):
        post = Post.query.get(id)
        db.session.delete(post)
        db.session.commit()
        return post