import React, { Component } from 'react';
import { Dialog } from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import ReactPlayer from 'react-player';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
// import Loader from "../Shared/Loader/Loader";
import TextField from '@material-ui/core/TextField';
import NadeDialogTitleSeparator from './style/img/arrow.png';
import fullStar from './style/img/fullStar.png';
import emptyStar from './style/img/emptyStar.png';
import emptyHeart from './style/img/verified.png';
import fullHeart from './style/img/fullHeart.png';
import plus from './style/img/plus.png';
import minus from './style/img/minus.png';
import ananas from './style/img/ananas.jpg';

class NadeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            nadePosition: {
                left: this.props.x,
                top: this.props.y
            },
            nadeInfo: {
                _id: this.props.id,
                name: '',
                type: '',
                tags: [],
                likes: '',
                dislikes: '',
                favorite: true, // Default value, need to dynamically set following the current user settings
                like: true, // Default value, need to dynamically set following the current user settings
                videoLink: '',
                comments: [],
                landmark: 0
            },
            commentsObjects: [],
            addComment: '',
            played: 0,
            playing: true,
            crosshair: false
        };
    }

    componentDidMount() {
        fetch(`http://localhost:8080/grenades/${ this.props.id}`, { method: 'GET' })
            .then(response => response.json())
            .then(async data => {
                const commentsObjectsPromises = data.comments.map(async commentId => {
                    const response = await fetch(`http://localhost:8080/comments/${commentId}`, { method: 'GET' });
                    return response.json();
                });
                const commentsObjects = await Promise.all(commentsObjectsPromises);

                this.setState({
                    nadeInfo: {
                        ...this.state.nadeInfo,
                        name: data.title,
                        type: data.type,
                        tags: data.tags,
                        likes: data.like,
                        dislikes: data.dislike,
                        videoLink: data.video,
                        comments: data.comments,
                        landmark: data.landmark
                    },
                    commentsObjects
                });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }

    handleAddComment = () => {
        const { user } = this.props;
        const { addComment, nadeInfo } = this.state;

        const commentSubmitted = {
            author: user._id,
            author_name: user.username,
            text: addComment,
            nadeDataId: nadeInfo._id
        };

        fetch('http://localhost:8080/comments', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentSubmitted)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // eslint-disable-next-line no-console
                    console.log(data);
                    this.setState({ errorMessage: data.error.description });
                } else {
                    this.setState(prevState => ({
                        nadeInfo: data.nadeData,
                        commentsObjects: [...prevState.commentsObjects, data.comment],
                        addComment: ''
                    }));
                }
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    };

    handleDeleteComment = commentId => {
        const { commentsObjects, nadeInfo } = this.state;
        const { user } = this.props;
        const deleteByUser = {
            userId: user._id,
            nadeDataId: nadeInfo._id
        };

        fetch(`http://localhost:8080/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: deleteByUser })
        })
            .then(response => response.json())
            .then(data => {
                const newCommentsObjects = commentsObjects.filter(comment => comment._id !== data.comment._id);

                this.setState({
                    nadeInfo: data.nadeData,
                    commentsObjects: newCommentsObjects
                });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    };

    goToLandmark = () => {
        this.player.seekTo(this.state.nadeInfo.landmark, 'seconds');
        this.setState({ playing: false });
    };

    addFavorite = () => {
        // eslint-disable-next-line no-console
        console.log('Add Favorite');
    };

    addLike = commentId => {
        const { user } = this.props;
        const { commentsObjects } = this.state;

        commentsObjects.forEach(comment => {
            if (comment._id === commentId && !comment.likes.includes(user._id)) {
                const commentToPatch = {
                    likeFromUser: user._id
                };

                fetch(`http://localhost:8080/comments/${commentId}`, {
                    method: 'PATCH',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentToPatch)
                })
                    .then(response => response.json())
                    .then(data => {
                        const newCommentsObjects = commentsObjects.map(newComment => {
                            if (newComment._id === data.comment._id) {
                                return data.comment;
                            }
                                return newComment;
                        });
                        this.setState({
                            commentsObjects: newCommentsObjects
                        });
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.error(error);
                    });
            } else {
                // eslint-disable-next-line no-console
                console.log('already liked');
            }
        });
    };

    removeLike = commentId => {
        const { user } = this.props;
        const { commentsObjects } = this.state;

        const commentToPatch = {
            dislikeFromUser: user._id
        };

        fetch(`http://localhost:8080/comments/${commentId}?option=dislike`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentToPatch)
        })
            .then(response => response.json())
            .then(data => {
                const newCommentsObjects = commentsObjects.map(comment => {
                    if (comment._id === data.comment._id) {
                        return data.comment;
                    }
                        return comment;
                });
                this.setState({
                    commentsObjects: newCommentsObjects
                });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    ref = player => {
        this.player = player;
    };

    render() {
        const { theme } = this.props;
        const {
            nadePosition, open, nadeInfo, commentsObjects,
            crosshair, played, playing, errorMessage
        } = this.state;

        // eslint-disable-next-line no-console
        console.log(played, playing, errorMessage);

        return (
            <MuiThemeProvider theme={theme}>
                <div className="nade-origin" style={nadePosition} onClick={() => this.setState({ open: true })} />
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                    fullWidth
                    maxWidth="md"
                >
                    <div className="NadeDialog-container">
                        <div className="title-container">
                            <div className="side">
                                <div className="text">
                                    <span>{nadeInfo.type}</span>
                                    <img src={NadeDialogTitleSeparator} alt="SMKD Separator" />
                                    <h2>{nadeInfo.name}</h2>
                                </div>
                                <div className="tags">
                                    {
                                        nadeInfo.tags.map(item => (
                                            <div className="tag" key={item}>
                                                <span>{item}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="side right">
                                <div className="buttons-container">
                                    <div className="favorite-button" onClick={this.addFavorite}>
                                        <img src={nadeInfo.favorite ? fullStar : emptyStar} alt="SMKD Favorite" />
                                    </div>
                                    <div className="like-button" onClick={this.addLike}>
                                        <img src={nadeInfo.favorite ? fullHeart : emptyHeart} alt="SMKD Favorite" />
                                        <span>{nadeInfo.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            <div className="video-container">
                                {
                                    crosshair && (
                                        <div className="crosshair-expension">
                                            <div className="vertical" />
                                            <div className="horizontal" />
                                        </div>
                                    )
                                }
                                <ReactPlayer
                                    ref={this.ref}
                                    url={`https://www.youtube.com/watch?v=${ nadeInfo.videoLink}`}
                                    playing
                                    onPause={() => this.setState({ playing: false })}
                                />
                            </div>
                            <div className="video-buttons">
                                <div className="button" onClick={this.goToLandmark}>Go to landmark</div>
                                <div className="button" onClick={() => this.setState({ crosshair: !crosshair })}>Expend crosshair</div>
                            </div>
                            <div className="comments-container">
                                <h3>{`${nadeInfo.comments.length }Comments`}</h3>
                                <div className="add-comment">
                                    <div className="comments">
                                        <div className="comment">
                                            <div className="img-container">
                                                <img src={ananas} alt="SMKD User profile" />
                                            </div>
                                            <div className="text-container">
                                                <div className="input-container">
                                                    <TextField
                                                        label="Your message ..."
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={e => {
                                                            this.setState({ addComment: e.target.value });
                                                        }}
                                                    />
                                                    <div className="send-button" onClick={() => this.handleAddComment()}>Send</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    commentsObjects.map(item => (
                                        <div className="comments" key={item}>
                                            <div className="comment">
                                                <div className="img-container">
                                                    <img src={ananas} alt="SMKD User" />
                                                </div>
                                                <div className="text-container">
                                                    <div className="text">
                                                        <span>{item.author_name}</span>
                                                        <span className="likes">{`${item.likes.length} points`}</span>
                                                    </div>
                                                    <p>{item.text}</p>
                                                    <div className="upvote-container">
                                                        <img src={plus} alt="SMKD plus" onClick={() => this.addLike(item._id)} />
                                                        <img src={minus} alt="SMKD minus" onClick={() => this.removeLike(item._id)} />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        border: '1px solid black', borderRadius: 5, cursor: 'pointer', height: '50%'
                                                    }}
                                                    onClick={() => this.handleDeleteComment(item._id)}
                                                >
                                                    {'Delete comment'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default NadeDialog;
