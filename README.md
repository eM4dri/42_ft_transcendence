
### Commits
Every commit has to start with an identifier example of the person who commits to keep properly tracking. Example `[TOMMY] add dockerfiles, docker-compose and folders`

### Working with branches

Below you'll find an image showing an  workflow example of using branches
	* *Master* the main branch, represents the stable and production-ready version of the project.
	* *Hotfix* branches are created to quickly address critical bugs or issues in the production version of the codebase.
	* *Release* branches is created when the development of a set of features or bug fixes is complete, and the codebase is ready for deployment as a specific release or version.
	* *Develop* the dev branch, is where ongoing development and integration of new features or bug fixes take place.
	* *Feature* brranches are created to work on specific features or enhancements independently from the main development branch.
Every temporary branch (Hotfix, Release, Feature) should start with its path to keep tracking of the ongoing work. Example: `Feature/init_struct`

In order to keep our repo clean, everyone should be responsible to remove temporary removable branches (Hotfix, Feature) on github (Is not a hard remove), once its aren't necessary (again every remove is retrievable)

<img width="1919" alt="Working with branches" src="images/branch_struct.png">

