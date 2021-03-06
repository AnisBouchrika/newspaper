import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllArticles, getMyArticles,searchArticle } from '../../store/actions/articlesActions';
import Article from '../../components/Article/Article';
import WrappedLink from '../../components/WrappedLink/WrappedLink';
import './Home.css';
import * as actionTypes from '../../store/actions/actionTypes';


class Home extends Component {
    state = {
        showMyArticles: false,
        searchValue : ''
    }

    componentWillMount() {
        if (this.props.location.pathname === '/article/myarticles' && !this.state.showMyArticles) {
            this.toggleShowMyArticles();
        }
    }

    componentDidMount() {
        this.props.initArticles();
        if (this.props.isAuthenticated) {
            this.props.getMyArticles();
        }
    }

    toggleShowMyArticles = () => {
        this.setState((prevState) => {
            return {
                showMyArticles: !prevState.showMyArticles
            }
        });
    }
    handleChange= (e) => {
        this.setState({searchValue: e.target.value});
    }
    handleNewArticleSubmit = (search) => {
        // this.props.searchArticle(search)
       
    }

    render() {
        let allArticles = this.props.allArticles || JSON.parse(localStorage.getItem('PublicNewspaperAllArticles'));
        allArticles = allArticles.map(article => (
            <Article
                key={article._id}
                id={article._id}
                title={article.title} />
        ));

        let myArticles = [];
        if (this.props.isAuthenticated && this.state.showMyArticles) {
            if (this.props.myArticles) {
                myArticles = [...this.props.myArticles];
            } else {
                myArticles = [...JSON.parse(localStorage.getItem('PublicNewspaperMyArticles'))]
            }
            myArticles = myArticles.map(article => (
                <Article
                    key={article._id}
                    id={article._id}
                    title={article.title} />
            ));
        }

        const showArticlesLink = <WrappedLink
                to={this.state.showMyArticles ? "/" : "/article/myarticles"}
                buttonClasses={['btn', 'btn-outline-info', 'mr-3', 'MyArticlesButton']}
                onClick={this.toggleShowMyArticles}>
                    { this.state.showMyArticles ? 'All Articles' : 'My Articles' }
                </WrappedLink>

        return (
            <div className="container">
                <br />
                <div className="Header">
                    <h1 style={{display: 'inline-block'}}>News feed</h1>
                    <WrappedLink to="/article/add" buttonClasses={['btn', 'btn-primary', 'mr-3', 'AddArticleButton']}>Add Article</WrappedLink>
                    {this.props.isAuthenticated && showArticlesLink}
                </div>
                <br />
                <div>
                    <section className="jumbotron">




                        
                    <p>
            	<form  class="form-inline" onKeyDown={e => e.key == "Enter" ? this.props.searchArticle(this.state.searchValue) : '' } onSubmit={(e) =>e.preventDefault()  }  >
            		<div class="form-group">

                        <input type="text"  defaultValue={this.state.searchValue}
                         onChange={this.handleChange} name="search"  placeholder="Filter by title..." class="form-control"/>
                         <input type="button" value='search'
                         onClick={()=>this.props.searchArticle(this.state.searchValue)}    class="btn btn-default" />
            		</div>
            	</form>
            </p>

                        <div className="Articles">
                            { this.state.showMyArticles ? myArticles : allArticles }
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allArticles: state.articles.articles,
        myArticles: state.articles.myArticles,
        isAuthenticated: state.users.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initArticles: () => dispatch(getAllArticles()),
        getMyArticles: () => dispatch(getMyArticles()),
        searchArticle: (search) => dispatch(searchArticle(search))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
