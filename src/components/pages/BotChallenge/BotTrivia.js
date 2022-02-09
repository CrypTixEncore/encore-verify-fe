import React, { Fragment } from 'react'
import '../../../App.css';
import { Component } from 'react'
import axios from '../../../settings/axios';
import { withRouter } from 'react-router-dom';
import PoweredBy from '../../PoweredBy';
import EndBotChallenge from './EndBotChallenge';
import Countdown from "react-countdown";
import './BotTrivia.css';
import BotChallenge from './BotChallenge'

export const BotQuestion = ({ question, image, isLoading, renderCountdown, chooseAnswer }) => {
    return (
        <div className="bot-question connect-triva">
            <div className="trival-block">
                <div className="container quest">
                    <div className="countern text-center mt-2">
                        {renderCountdown && renderCountdown()}
                    </div>
                    <div className="questions">
                        <div className="head3 bold-text">
                            {question.question}
                        </div>
                        <p>{question.description}</p>
                    </div>
                    {image && (
                        <div>
                            <div className="media-c">
                                <img src={image.src} alt="question" className="drop-shadow img" />
                            </div>
                        </div>
                    )}
                    <div className="options">
                        <div>
                            <button className="btn btnChan text-left"
                                disabled={isLoading}
                                onClick={() => chooseAnswer("option1")}
                            >
                                {question.option1}
                            </button>
                        </div>
                        <div>
                            <button className="btn btnChan  text-left"
                                disabled={isLoading}
                                onClick={() => chooseAnswer("option2")}
                            >
                                {question.option2}
                            </button>
                        </div>
                        <div>
                            <button className="btn btnChan text-left"
                                disabled={isLoading}
                                onClick={() => chooseAnswer("option3")}
                            >
                                {question.option3}
                            </button>
                        </div>
                        <div>
                            <button className="btn btnChan text-left"
                                disabled={isLoading}
                                onClick={() => chooseAnswer("option4")}
                            >
                                {question.option4}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};


class BotTrivia extends Component {
    constructor() {
        super();
        this.state = {
            currentQuestion: 0,
            answers: [],
            finishQuiz: false,
            result: 0,
            loaded: false,
            score: 0,
            totalTime: 0,
            allowedTime: 15,
            bufferCard: true,
            bufferTime: 3,
            images: [],
            option: '',
            returnObj: null,
            isLoading: true,
            quizStatus: 'PASSED',
            warning: { status: false, msg: '', type: '' },
        };

        this.updateAnswer = this.updateAnswer.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.chooseAnswer = this.chooseAnswer.bind(this);
        this.quizTimerChild = React.createRef();
        this.bufferTimerChild = React.createRef();
    }

    chooseAnswer = async (option) => {
        this.setState({
            isLoading: true
        })
        this.quizTimerChild.current.pause();
        await this.setState({
            option: option
        })
    }

    updateAnswer = async (timeLeft) => {
        let ans = ' '

        if (timeLeft > 0) {
            ans = this.state.option
        }

        const timePassed = (parseInt(this.state.allowedTime) - timeLeft).toFixed(2)

        // let key = this.props.questions[this.state.currentQuestion].questionId;
        let key = this.props.questions[this.state.currentQuestion].question_id;
        let temp = await this.state.answers;

        temp.push({
            answer: ans,
            questionId: key,
        })

        const totalTime = parseFloat(this.state.totalTime)

        const newTotalTime = (totalTime + parseFloat(timePassed))

        await this.setState(() => ({
            answers: temp,
            totalTime: parseFloat((newTotalTime).toFixed(2))
        }))

        await this.setState(() => ({
            bufferCard: true
        }))

        let current = this.state.currentQuestion + 1;

        if (current === this.props.questions.length) {
            await this.setState(() => ({
                bufferCard: false
            }))

            console.log(JSON.stringify(this.state.answers))
            try {
                const returnObj = await axios.post(
                    '/bot-questions/verify-human', {
                        answers: this.state.answers,
                        wallet: this.props.wallet,
                        rpcUrl: this.props.endpoint,
                        gatekeeperNetwork: this.props.gatekeeperNetwork.toBase58()
                    });

                console.log(returnObj)

                this.setState({
                    finishQuiz: true,
                    returnObj: returnObj.data,
                    isLoading: false
                })
            } catch {
                await this.setState({
                    quizStatus: 'FAILED'
                })

                this.setState({
                    finishQuiz: true,
                    isLoading: false
                })
            }
        } else {
            await this.updateQuestion();
            this.bufferTimerChild.current.start();
        }
    }

    updateQuestion = async () => {
        let current = this.state.currentQuestion + 1;

        await this.setState(() => ({
            currentQuestion: current,
        }))
    }

    componentDidMount = async () => {
        this.setState({
            isLoading: true
        })
        const images = []

        this.props.questions.forEach((picture) => {
            if (picture.question_image) {
                let img = new Image();
                // img.src = picture.media;
                img.src = picture.question_image;
                images.push(img)
            } else {
                images.push(null)
            }
        });

        this.setState({
            images: images,
            isLoading: false
        })

        this.bufferTimerChild.current.start();
    }

    renderCountdown = () => {
        return (
            <Countdown
                date={Date.now() + this.state.allowedTime * 1000}
                intervalDelay={2}
                precision={0}
                ref={this.quizTimerChild}
                controlled={false}
                autoStart={true}
                renderer={props => <div className="head5 text-left timer">
                    <span className="blue-text">{this.state.currentQuestion + 1} of {this.props.questions.length}</span> with <span className="blue-text">{(props.total / 1000)} seconds</span> remaining
                </div>}
                onPause={async (props) => this.updateAnswer((props.total / 1000).toFixed(2))}
                onComplete={async () => this.updateAnswer(0)}
            />
        );
    }

    render() {
        return (
            <div>
                {this.state.bufferCard && (
                    <div className="text-center bot-container pt-5 pb-4">
                        <Countdown
                            date={Date.now() + 3 * 1000}
                            ref={this.bufferTimerChild}
                            autoStart={false}
                            intervalDelay={0}
                            precision={0}
                            onComplete={async () => {
                                await this.setState({ bufferCard: false, isLoading: false });
                            }}
                            renderer={props =>
                                <Fragment>
                                    <div className="head3 bold-text">{this.state.currentQuestion === 0 ? 'The challenge starts in' : 'Next question in'}: <div className="blue-text my-5 bold-text countdown-text">{props.total / 1000}</div></div>
                                </Fragment>
                            }
                        />
                        <PoweredBy />
                    </div>
                )}
                {!this.state.bufferCard && (
                    <div className="bot-container container pb-4">
                        {this.props.questions && this.props.questions.length !== 0 && !this.state.finishQuiz && (
                            <>
                                <BotQuestion question={this.props.questions[this.state.currentQuestion]}
                                             image={this.state.images[this.state.currentQuestion]}
                                             isLoading={this.state.isLoading}
                                             renderCountdown={this.renderCountdown}
                                             chooseAnswer={this.chooseAnswer}
                                />
                                <PoweredBy />
                            </>
                        )}
                        {/*(!this.props.questions || this.props.questions.length === 0) && this.state.loaded && (
                            <div className="margin-auto width-50">
                                <h3>Quiz wrapped up!</h3>
                            </div>
                        )*/}
                        {!this.state.isLoading && this.state.finishQuiz && this.state.quizStatus === 'PASSED' &&(
                            <EndBotChallenge sendableTransaction={this.state.returnObj}/>
                        )}
                    </div>

                )}
                {!this.state.bufferCard && !this.state.isLoading && this.state.finishQuiz && this.state.quizStatus === 'FAILED' &&(
                    <BotChallenge endpoint={this.props.endpoint} gatekeeperNetwork={this.props.gatekeeperNetwork} failed={true}/>
                )}
            </div>
        )
    }
}

export default withRouter(BotTrivia)