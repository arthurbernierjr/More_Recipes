import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'react-proptypes';
import classnames from 'classnames';
import { connect } from 'react-redux';
import swal from 'sweetalert2';
import { bindActionCreators } from 'redux';
import Spinner from 'react-md-spinner';
import { getRecipe,
  processRecipeActions,
  clearToast
} from '../actions/recipe/recipeActions';
import recipeValidate from '../utils/recipeValidate';
import FooterComponent from './partials/Footer.jsx';
import Header from './partials/Headers/Header.jsx';
import { recipeResponseType } from '../utils/helpers';


/**
 *
 * @class EditRecipe
 * 
 * @extends {React.Component}
 */
export class EditRecipe extends Component {
  /**
   * Creates an instance of SignInComponent.
   * 
   * @param {any} props
   * 
   * @memberof EditRecipe
   */
  constructor(props) {
    super(props);
    this.state = {
      recipeDetails: {
        name: '',
        description: '',
        ingredient: '',
      },
      errors: {},
      imageFile: '',
      imageSrc: process.env.NO_IMAGE
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  /**
   *
   * @returns {XML} XML/JSX
   * 
   * @memberof EditRecipe
   */
  componentWillMount() {
    const recipeId = this.props.match.params.recipeId;
    this.props.getRecipe(recipeId);
  }
  /**
   * @return {object} nextProps
   * 
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { message, responseType, recipe } = nextProps.recipeState;
    if (recipe.ingredient !== this.state.recipeDetails.ingredient) {
      this.setState({ recipeDetails: recipe });
      this.setState({ imageSrc: recipe.imageUrl });
    }
    if (responseType === recipeResponseType.EDIT_RECIPE_SUCCESS 
      && message !== '') {
      swal({
        position: 'top-end',
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
      this.props.clearToast();
      this.props.history.push(`/recipes/${recipe.id}`);
    } else if (message !== '') {
      swal({
        position: 'top-end',
        type: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
      this.props.clearToast();
    }
  }
  /**
   * Handle submit
   *
   * @return {object} event
   * 
   * @param {object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    if (this.checkValidity()) {
      this.setState({ errors: {} });
      const recipeId = this.props.match.params.recipeId;
      this.props.processRecipeActions(this.state.recipeDetails,
        this.state.imageFile,
        'updateRecipe',
        recipeId
      );
    }
  }
  /**
   * Handle Image Upload
   *
   * @return {object} event
   * 
   * @param {object} event
   */
  handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      this.setState({ imageFile: event.target.files[0] });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ imageSrc: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.setState({
        imageSrc: process.env.NO_IMAGE,
        imageFile: ''
      });
    }
  }
  /**
   * Check Validity
   *
   * @return {object} event
   * 
   * @param {object} event
   */
  checkValidity() {
    const { errors, isValid } = recipeValidate(this.state.recipeDetails);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  /**
   * Handle change
   *
   * @return {object} event
   * 
   * @param {object} event
   */
  handleChange(event) {
    const recipeDetails = this.state.recipeDetails;
    recipeDetails[event.target.name] = event.target.value;
    this.setState({ recipeDetails });
  }
  /**
   *
   *
   * @returns {XML} XML/JSX
   * 
   * @memberof EditRecipe
   */
  render() {
    const { recipeDetails, imageSrc, errors } = this.state;
    return (
      <div>
        <Header/>
        <div className="wrapper">
          <ol
            className="breadcrumb
            container mt-50 mb-10 col-md-9 mx-auto bg-white shadow-lite">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="#">Recipes</Link>
            </li>
            <li className="breadcrumb-item active">Edit Recipe</li>
          </ol>
          <div className="container
          mb-20 col-md-9 mx-auto recipe-details-container">
            <div className="row">
              <div
                className="col-12
                col-sm-6 col-md-4 col-lg-4 p-10 shadow-lite bg-white"
                style={{
                  height: `${400}px`,
                  maxHeight: `${400}px`
                }}>
                <div
                  className="light-well center-content"
                  style={{
                    height: `${100}%`
                  }}>
                  <div className="text-center
                  file-upload full-height full-width center-content">
                    <input
                      type="file"
                      className="recipe-upload text-hide"
                      onChange={this.handleImageChange}
                      accept="image/*" />
                    <img src={imageSrc || process.env.NO_IMAGE}
                      alt="Image" height="400" width="100%"/>
                  </div>
                </div><br/>
                <span className="text-info">
                Please click to upload an image &nbsp;
                  <i className="fa fa-upload" />
                </span>
              </div>
              <div
                className="simplebox
                blade col-12 col-sm-6 col-md-8 col-lg-8 p-10"
                style={{
                  boxShadow: 'none'
                }}>
                <h5>Recipe Details</h5>
                <form className="mt-15 recipe-form"
                  onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="text"
                      className={
                        classnames(
                          'form-control',
                          { 'is-invalid': errors.name ? !!errors.name : false }
                        )
                      }
                      name="name"
                      aria-describedby="name"
                      onChange={this.handleChange}
                      value={recipeDetails.name}
                      placeholder="Recipe Name"
                    />
                    { errors.name ?
                      <span className="invalid-feedback">{ errors.name }</span>
                      : null
                    }
                  </div>
                  <h6>Description</h6>
                  <div className="form-group">
                    <textarea
                      className={
                        classnames(
                          'form-control',
                          {
                            'is-invalid': errors.description ?
                              !!errors.description : false
                          }
                        )
                      }
                      rows="4"
                      name="description"
                      onChange={this.handleChange}
                      value={recipeDetails.description}
                      placeholder="Recipe description here" />
                    { errors.description ?
                      <span className="invalid-feedback">{ errors.description }
                      </span> : null
                    }
                  </div>
                  <h6>Ingredients</h6>
                  <div className="form-group">
                    <textarea className={classnames('form-control', {
                      'is-invalid': errors.ingredient ? !!errors.ingredient
                        : false
                    })}
                    rows="4"
                    placeholder="Ingredient1, ingredient2..."
                    name="ingredient"
                    value={recipeDetails.ingredient}
                    onChange={this.handleChange}
                    />
                    <span className="small text-info">
                    Please enter comma separated values
                    </span>
                    { errors.ingredient ?
                      <span className="invalid-feedback">{ errors.ingredient }
                      </span> : null
                    }
                  </div>
                  <button type="submit"
                    className="btn btn btn-success float-right"
                    disabled={this.props.recipeState.isCreating}>
                    {this.props.recipeState.isCreating ?
                      <span>Updating Recipe... <Spinner size={20} />
                      </span> : 'Update Recipe' }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

EditRecipe.propTypes = {
  recipeState: PropTypes.object.isRequired,
  getRecipe: PropTypes.func.isRequired,
  processRecipeActions: PropTypes.func.isRequired,
  clearToast: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.func
};

const mapStateToProps = state => ({
  recipeState: state.recipeReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getRecipe, processRecipeActions, clearToast }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditRecipe);
