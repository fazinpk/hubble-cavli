export const EXHIBITOR_LIST_QUERY = `
  query exhibitorList($first: Int, $after: Int, $group: String) {
    catalogueQueries {
      exhibitorsWithWishListGroup(first: $first, after: $after, group: $group) {
        totalCount
        exhibitors {
          customer {
            id
            userId
            showId
            companyName
            country
            squareLogo
            exhibitorDetail {
              boothNo
              hallNo
            }
            show {
              showName
              startDate
              endDate
            }
          }
        }
      }
    }
  }
`;

export const EXHIBITOR_DETAIL_QUERY = `
  query exhibitorDetail($userId: String, $showId: Int) {
    globalAnonymousQueries {
      customers(userId: $userId, showId: $showId) {
        website
        companyProfile
        address1
        address2
        city
        state
        postalCode
        linkedinLink
        twitterLink
        facebookLink
        youtubeLink
        exhibitorDetail {
          shortCompanyProfile
        }
        customerCategories {
          category {
            id
            categoryType
            mainCategory
            categoryName
            subCategory
          }
        }
      }
    }
  }
`;
